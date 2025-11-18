import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { useMissions } from '@/hooks/useMissions';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GEMS } from '@/services/gemService';

export default function ProfileScreen() {
  const { inventory, coins, geodesOpened, getTotalValue, getTotalGems, getUniqueGems, getRarityCount, addCoins } = useInventory();
  const missions = useMissions({
    totalGems: getTotalGems(),
    uniqueGems: getUniqueGems(),
    coins,
    geodesOpened,
    rarityCount: getRarityCount(),
  });
  const [showAllMissions, setShowAllMissions] = useState(false);
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const collectionProgress = Math.round((getUniqueGems() / GEMS.length) * 100);

  const stats = [
    {
      icon: 'diamond' as const,
      label: 'Pierres totales',
      value: getTotalGems(),
      color: '#2563EB',
    },
    {
      icon: 'albums' as const,
      label: 'Uniques',
      value: `${getUniqueGems()}/${GEMS.length}`,
      color: '#8B5CF6',
    },
    {
      icon: 'hammer' as const,
      label: 'Géodes ouvertes',
      value: geodesOpened,
      color: '#EF4444',
    },
    {
      icon: 'cash' as const,
      label: 'Pièces',
      value: coins,
      color: '#F59E0B',
    },
  ];

  const handleClaimMission = async (missionId: string) => {
    const success = await missions.claimReward(missionId, (reward) => {
      addCoins(reward);
      Alert.alert(
        '🎉 Mission complétée !',
        `Vous avez gagné ${reward} pièces !`,
        [{ text: 'Super !' }]
      );
    });

    if (!success) {
      Alert.alert('Erreur', 'Impossible de réclamer cette récompense.');
    }
  };

  const activeMissions = missions.getActiveMissions();
  const displayedMissions = showAllMissions ? activeMissions : activeMissions.slice(0, 5);

  const handleResetProgress = () => {
    Alert.alert(
      'Réinitialiser',
      'Cette fonctionnalité permet de réinitialiser votre progression. Elle sera disponible prochainement!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <ThemedText type="title" style={styles.name}>
            Collectionneur
          </ThemedText>
          <ThemedText style={[styles.username, { color: textSecondaryColor }]}>
            @geodex_master
          </ThemedText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stat.value}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondaryColor }]}>
                {stat.label}
              </ThemedText>
            </Card>
          ))}
        </View>

        {/* Collection Progress */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Progression de collection</ThemedText>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressTitle}>
                {collectionProgress}% complété
              </ThemedText>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: textSecondaryColor + '20' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: primaryColor,
                    width: `${collectionProgress}%`,
                  },
                ]}
              />
            </View>
            <ThemedText style={[styles.progressText, { color: textSecondaryColor }]}>
              {getUniqueGems()} sur {GEMS.length} pierres découvertes
            </ThemedText>
          </Card>
        </View>

        {/* Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Missions</ThemedText>
            {missions.getTotalRewardsAvailable() > 0 && (
              <View style={[styles.rewardBadge, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="gift" size={16} color="#10B981" />
                <ThemedText style={[styles.rewardText, { color: '#10B981' }]}>
                  +{missions.getTotalRewardsAvailable()}
                </ThemedText>
              </View>
            )}
          </View>

          {displayedMissions.length === 0 ? (
            <Card style={styles.emptyMissionsCard}>
              <Ionicons name="checkmark-done-circle" size={48} color="#10B981" />
              <ThemedText style={styles.emptyMissionsTitle}>
                Toutes les missions sont complétées !
              </ThemedText>
              <ThemedText style={[styles.emptyMissionsDesc, { color: textSecondaryColor }]}>
                Revenez plus tard pour de nouvelles missions
              </ThemedText>
            </Card>
          ) : (
            <>
              {displayedMissions.map(({ mission, progress, status, percentage }) => (
                <Card key={mission.id} style={styles.missionCard}>
                  <View style={styles.missionLeft}>
                    <View style={[styles.missionIcon, { backgroundColor: primaryColor + '20' }]}>
                      <ThemedText style={styles.missionEmoji}>{mission.icon}</ThemedText>
                    </View>
                    <View style={styles.missionContent}>
                      <ThemedText style={styles.missionTitle}>{mission.title}</ThemedText>
                      <ThemedText style={[styles.missionDesc, { color: textSecondaryColor }]}>
                        {mission.description}
                      </ThemedText>
                      <View style={styles.missionProgress}>
                        <View style={[styles.progressBarBg, { backgroundColor: textSecondaryColor + '20' }]}>
                          <View
                            style={[
                              styles.progressBarMission,
                              {
                                backgroundColor: status === 'completed' ? '#10B981' : primaryColor,
                                width: `${percentage}%`,
                              },
                            ]}
                          />
                        </View>
                        <ThemedText style={[styles.progressLabel, { color: textSecondaryColor }]}>
                          {progress}/{mission.target}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  {status === 'completed' ? (
                    <Pressable
                      onPress={() => handleClaimMission(mission.id)}
                      style={[styles.claimButton, { backgroundColor: '#10B981' }]}
                    >
                      <Ionicons name="gift" size={20} color="#FFFFFF" />
                      <ThemedText style={styles.claimText}>+{mission.reward}</ThemedText>
                    </Pressable>
                  ) : (
                    <View style={[styles.rewardBadgeSmall, { backgroundColor: primaryColor + '20' }]}>
                      <Ionicons name="cash" size={14} color={primaryColor} />
                      <ThemedText style={[styles.rewardTextSmall, { color: primaryColor }]}>
                        {mission.reward}
                      </ThemedText>
                    </View>
                  )}
                </Card>
              ))}
              {!showAllMissions && activeMissions.length > 5 && (
                <Pressable onPress={() => setShowAllMissions(true)} style={styles.showMoreButton}>
                  <ThemedText style={[styles.showMoreText, { color: primaryColor }]}>
                    Voir toutes les missions ({activeMissions.length})
                  </ThemedText>
                  <Ionicons name="chevron-down" size={20} color={primaryColor} />
                </Pressable>
              )}
            </>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Paramètres</ThemedText>
          <Card>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name={colorScheme === 'dark' ? 'moon' : 'sunny'} size={20} color={primaryColor} />
                <ThemedText style={styles.settingText}>Thème</ThemedText>
              </View>
              <ThemedText style={[styles.settingValue, { color: textSecondaryColor }]}>
                {colorScheme === 'dark' ? 'Sombre' : 'Clair'}
              </ThemedText>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressCard: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  missionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  missionEmoji: {
    fontSize: 24,
  },
  missionContent: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  missionDesc: {
    fontSize: 13,
    marginBottom: 8,
  },
  missionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressBarMission: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 40,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  claimText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rewardBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  rewardTextSmall: {
    fontSize: 12,
    fontWeight: '600',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMissionsCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyMissionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyMissionsDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
});
