import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MISSIONS, Mission, MissionStatus } from '@/services/missionService';
import { GemRarity } from '@/services/gemService';

const MISSIONS_PROGRESS_KEY = '@geodex_missions_progress';
const MISSIONS_STATUS_KEY = '@geodex_missions_status';

export type MissionProgress = {
  [missionId: string]: number;
};

export type MissionStatuses = {
  [missionId: string]: MissionStatus;
};

type UseMissionsProps = {
  totalGems: number;
  uniqueGems: number;
  coins: number;
  geodesOpened: number;
  rarityCount: { [key in GemRarity]: number };
};

export function useMissions({
  totalGems,
  uniqueGems,
  coins,
  geodesOpened,
  rarityCount,
}: UseMissionsProps) {
  const [progress, setProgress] = useState<MissionProgress>({});
  const [statuses, setStatuses] = useState<MissionStatuses>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, []);

  // Update progress based on stats
  useEffect(() => {
    if (!isLoading) {
      updateProgress();
    }
  }, [totalGems, uniqueGems, coins, geodesOpened, rarityCount, isLoading]);

  const loadMissions = async () => {
    try {
      const [storedProgress, storedStatuses] = await Promise.all([
        AsyncStorage.getItem(MISSIONS_PROGRESS_KEY),
        AsyncStorage.getItem(MISSIONS_STATUS_KEY),
      ]);

      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }

      if (storedStatuses) {
        setStatuses(JSON.parse(storedStatuses));
      } else {
        // Initialize all missions as active
        const initialStatuses: MissionStatuses = {};
        MISSIONS.forEach((mission) => {
          initialStatuses[mission.id] = 'active';
        });
        setStatuses(initialStatuses);
      }
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (newProgress: MissionProgress) => {
    try {
      await AsyncStorage.setItem(MISSIONS_PROGRESS_KEY, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const saveStatuses = async (newStatuses: MissionStatuses) => {
    try {
      await AsyncStorage.setItem(MISSIONS_STATUS_KEY, JSON.stringify(newStatuses));
    } catch (error) {
      console.error('Error saving statuses:', error);
    }
  };

  const updateProgress = () => {
    const newProgress: MissionProgress = { ...progress };
    const newStatuses: MissionStatuses = { ...statuses };
    let hasChanges = false;

    MISSIONS.forEach((mission) => {
      // Skip if already claimed
      if (statuses[mission.id] === 'claimed') return;

      let currentProgress = 0;

      switch (mission.type) {
        case 'open_geodes':
          currentProgress = geodesOpened;
          break;
        case 'collect_gems':
          currentProgress = totalGems;
          break;
        case 'collect_unique':
          currentProgress = uniqueGems;
          break;
        case 'accumulate_coins':
          currentProgress = coins;
          break;
        case 'collect_rarity':
          if (mission.rarity) {
            currentProgress = rarityCount[mission.rarity as GemRarity] || 0;
          }
          break;
      }

      // Update progress if changed
      if (newProgress[mission.id] !== currentProgress) {
        newProgress[mission.id] = currentProgress;
        hasChanges = true;
      }

      // Mark as completed if target reached
      if (currentProgress >= mission.target && statuses[mission.id] === 'active') {
        newStatuses[mission.id] = 'completed';
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setProgress(newProgress);
      setStatuses(newStatuses);
      saveProgress(newProgress);
      saveStatuses(newStatuses);
    }
  };

  const claimReward = async (missionId: string, onReward: (amount: number) => void) => {
    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission || statuses[missionId] !== 'completed') {
      return false;
    }

    const newStatuses = { ...statuses, [missionId]: 'claimed' as MissionStatus };
    setStatuses(newStatuses);
    await saveStatuses(newStatuses);

    // Give reward
    onReward(mission.reward);
    return true;
  };

  const getMissionWithStatus = (mission: Mission) => {
    return {
      mission,
      progress: progress[mission.id] || 0,
      status: statuses[mission.id] || 'active',
      percentage: Math.min(100, ((progress[mission.id] || 0) / mission.target) * 100),
    };
  };

  const getActiveMissions = () => {
    return MISSIONS.filter((m) => statuses[m.id] !== 'claimed').map(getMissionWithStatus);
  };

  const getCompletedMissions = () => {
    return MISSIONS.filter((m) => statuses[m.id] === 'completed').map(getMissionWithStatus);
  };

  const getClaimedMissions = () => {
    return MISSIONS.filter((m) => statuses[m.id] === 'claimed').map(getMissionWithStatus);
  };

  const getTotalRewardsAvailable = () => {
    return MISSIONS.filter((m) => statuses[m.id] === 'completed').reduce(
      (sum, m) => sum + m.reward,
      0
    );
  };

  return {
    isLoading,
    progress,
    statuses,
    claimReward,
    getMissionWithStatus,
    getActiveMissions,
    getCompletedMissions,
    getClaimedMissions,
    getTotalRewardsAvailable,
  };
}
