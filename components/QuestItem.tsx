import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import { DailyQuest } from '../contexts/AppContext';

interface QuestItemProps {
  quest: DailyQuest;
  onToggle: () => void;
  onEdit: (title: string, description: string) => void;
  onDelete: () => void;
}

export function QuestItem({ quest, onToggle, onEdit, onDelete }: QuestItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(quest.title);
  const [editDesc, setEditDesc] = useState(quest.description);

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Quest title cannot be empty');
      return;
    }
    onEdit(editTitle.trim(), editDesc.trim());
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Quest', `Remove "${quest.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  if (editing) {
    return (
      <View style={styles.card}>
        <TextInput
          style={styles.editInput}
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="Quest title"
          placeholderTextColor={Colors.textDim}
        />
        <TextInput
          style={[styles.editInput, styles.editDesc]}
          value={editDesc}
          onChangeText={setEditDesc}
          placeholder="Quest description"
          placeholderTextColor={Colors.textDim}
          multiline
        />
        <View style={styles.editActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEdit}>
            <Text style={styles.saveEditBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, quest.completed && styles.cardCompleted]}>
      <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
        {quest.completed ? (
          <FontAwesome name="check-square" size={24} color={Colors.emerald} />
        ) : (
          <FontAwesome name="square-o" size={24} color={Colors.textDim} />
        )}
      </TouchableOpacity>

      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, quest.completed && styles.titleDone]}>{quest.title}</Text>
          {quest.isCustom && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>Custom</Text>
            </View>
          )}
        </View>
        <Text style={[styles.desc, quest.completed && styles.descDone]}>{quest.description}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setEditing(true)} style={styles.actionBtn}>
          <FontAwesome name="pencil" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
          <FontAwesome name="trash-o" size={16} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 10,
  },
  cardCompleted: {
    backgroundColor: Colors.bgCardLight,
    borderColor: Colors.emeraldMuted,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
    padding: 4,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  descDone: {
    color: Colors.textDim,
  },
  customBadge: {
    backgroundColor: Colors.info,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
  },
  editInput: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  editDesc: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
  },
  cancelBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveEditBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.emerald,
  },
  saveEditBtnText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
});
