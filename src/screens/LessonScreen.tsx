import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LessonScreen: React.FC = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState('Choose a Lesson');

  const chapters = [
    { id: '1', title: 'Introduction to the Constitution' },
    { id: '2', title: 'History of Our Constitution' },
    { id: '3', title: 'Basic Law Principles' },
    { id: '4', title: 'Fundamental Rights & Duties' },
    { id: '5', title: 'Directive Principles' },
  ];

  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter);
    setDropdownVisible(false); // Close dropdown after selection
  };

  return (
    <View style={styles.container}>
      {/* Top Bar Dropdown */}
      <TouchableOpacity style={styles.topBar} onPress={() => setDropdownVisible(!isDropdownVisible)}>
        <Text style={styles.chapterText}>{selectedChapter}</Text>
        <Icon name={isDropdownVisible ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#fff" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={chapters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleChapterSelect(item.title)}>
                <Text style={styles.dropdownText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Lesson Content */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>{selectedChapter}</Text>
        <Text style={styles.contentText}>
          {selectedChapter === 'Choose a Lesson'
            ? 'Please select a lesson from the dropdown above to view the content.'
            : `Here is the content for "${selectedChapter}". You can read about its importance and application in Indian law.`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    backgroundColor: '#2196F3',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    marginBottom: 5,
  },
  chapterText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  contentText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
  },
});

export default LessonScreen;
