import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { CoinDisplay } from '../../components/CoinDisplay';
import { QuestItem } from '../../components/QuestItem';
import { useAppContext } from '../../contexts/AppContext';

export default function QuestsScreen() {
  const router = useRouter();
  const {
    coins,
    profile,
    dailyQuests,
    toggleQuest,
    editQuest,
    deleteQuest,
    addCustomQuest,
    generateAIQuests,
    questsLoading,
  } = useAppContext();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const completedCount = dailyQuests.filter((q) => q.completed).length;
  const totalCount = dailyQuests.length;

  const handleAddCustom = () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a quest title');
      return;
    }
    addCustomQuest(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleRegenerate = () => {
    Alert.alert(
      'Regenerate Quests',
      'This will replace all current AI quests. Custom quests will be kept. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', onPress: generateAIQuests },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topRow}>
        <CoinDisplay coins={coins} />
      </View>

      {!profile && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyTitle}>Set Up Your Profile</Text>
          <Text style={styles.emptyDesc}>
            Create your fitness profile to get personalized AI-generated quests tailored to your goals.
          </Text>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <Text style={styles.profileBtnText}>Open Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {profile && dailyQuests.length === 0 && !questsLoading && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyTitle}>Ready for Quests!</Text>
          <Text style={styles.emptyDesc}>
            Generate personalized daily quests based on your profile.
          </Text>
          <TouchableOpacity style={styles.generateBtn} onPress={generateAIQuests}>
            <Text style={styles.generateBtnText}>Generate AI Quests</Text>
          </TouchableOpacity>
        </View>
      )}

      {questsLoading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.emerald} />
          <Text style={styles.loadingText}>Generating your quests...</Text>
        </View>
      )}

      {dailyQuests.length > 0 && (
        <>
          <View style={styles.progressRow}>
            <Text style={styles.sectionTitle}>Daily Quests</Text>
            <Text style={styles.progressText}>
              {completedCount}/{totalCount} done
            </Text>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' },
              ]}
            />
          </View>

          {dailyQuests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={quest}
              onToggle={() => toggleQuest(quest.id)}
              onEdit={(title, desc) => editQuest(quest.id, title, desc)}
              onDelete={() => deleteQuest(quest.id)}
            />
          ))}

          <View style={styles.actionsRow}>
            {profile && (
              <TouchableOpacity style={styles.regenBtn} onPress={handleRegenerate}>
                <FontAwesome name="refresh" size={14} color={Colors.white} />
                <Text style={styles.regenBtnText}> Regenerate</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddForm(!showAddForm)}>
              <FontAwesome name="plus" size={14} color={Colors.white} />
              <Text style={styles.addBtnText}> Add Quest</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {showAddForm && (
        <View style={styles.addForm}>
          <Text style={styles.addFormTitle}>Add Custom Quest</Text>
          <TextInput
            style={styles.addInput}
            placeholder="Quest title"
            placeholderTextColor={Colors.textDim}
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TextInput
            style={[styles.addInput, styles.addDescInput]}
            placeholder="Description (optional)"
            placeholderTextColor={Colors.textDim}
            value={newDesc}
            onChangeText={setNewDesc}
            multiline
          />
          <View style={styles.addFormActions}>
            <TouchableOpacity
              style={styles.addFormCancel}
              onPress={() => setShowAddForm(false)}>
              <Text style={styles.addFormCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addFormSave} onPress={handleAddCustom}>
              <Text style={styles.addFormSaveText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.emerald,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.emerald,
    borderRadius: 4,
  },
  emptyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  profileBtn: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  profileBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  generateBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  loadingCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  regenBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    paddingVertical: 12,
  },
  regenBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.info,
    borderRadius: 12,
    paddingVertical: 12,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  addForm: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 16,
    marginTop: 12,
  },
  addFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 12,
  },
  addInput: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  addDescInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  addFormActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  addFormCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
  },
  addFormCancelText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  addFormSave: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.info,
  },
  addFormSaveText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
});
