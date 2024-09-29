import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
}

interface FeaturedArticle {
  id: string;
  title: string;
  imageUrl: string;
}

const categories: Category[] = [
  { id: '1', name: 'Criminal Law' },
  { id: '2', name: 'Constitutional Law' },
  { id: '3', name: 'Civil Law' },
  { id: '4', name: 'Legal Procedures' },
  { id: '5', name: 'Family Law' },
  { id: '6', name: 'Corporate Law' },
];

const featuredArticles: FeaturedArticle[] = [
  { id: '1', title: 'Understanding Fundamental Rights', imageUrl: 'https://example.com/image1.png' },
  { id: '2', title: 'Recent Changes in Corporate Law', imageUrl: 'https://example.com/image2.png' },
  { id: '3', title: 'Navigating Family Court Procedures', imageUrl: 'https://example.com/image3.png' },
];

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderQuickAccessButton = (iconName: string, text: string, color: string) => (
    <TouchableOpacity style={styles.quickAccessButton}>
      <Icon name={iconName} size={28} color={color} />
      <Text style={styles.quickAccessText}>{text}</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedArticle = ({ item }: { item: FeaturedArticle }) => (
    <TouchableOpacity style={styles.featuredCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
      <Text style={styles.featuredTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Edu-Law</Text>
        <Text style={styles.subtitle}>Simplifying Indian Law for Everyone</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Icon name="person" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Indian Law..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quick Access Buttons */}
      <View style={styles.quickAccessContainer}>
        {renderQuickAccessButton('gavel', 'Fundamental Rights', '#4caf50')}
        {renderQuickAccessButton('book', 'Landmark Judgments', '#ff9800')}
        {renderQuickAccessButton('menu-book', 'Legal Dictionary', '#03a9f4')}
        {renderQuickAccessButton('quiz', 'Quizzes', '#f44336')}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Featured Section */}
      <View style={styles.featuredContainer}>
        <Text style={styles.sectionTitle}>Featured Articles</Text>
        <FlatList
          data={featuredArticles}
          renderItem={renderFeaturedArticle}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={width - 32}
          decelerationRate="fast"
        />
      </View>

      {/* Progress Tracker */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Your Learning Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>
        <Text style={styles.progressText}>60% of the Fundamental Rights module completed</Text>
      </View>

      {/* Daily Tip */}
      <View style={styles.dailyTipContainer}>
        <Text style={styles.dailyTipTitle}>Daily Legal Insight</Text>
        <Text style={styles.dailyTipText}>
          Did you know? Article 21 guarantees the Right to Life and Personal Liberty.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#007bff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    position: 'relative',
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  profileIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  quickAccessButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
  },
  quickAccessText: {
    marginTop: 10,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
    elevation: 3,
  },
  categoryText: {
    color: '#007bff',
    fontWeight: '600',
  },
  featuredContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    marginRight: 16,
  },
  featuredImage: {
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  progressText: {
    color: '#333',
  },
  dailyTipContainer: {
    padding: 15,
    backgroundColor: '#e9f5ff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
  },
  dailyTipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  dailyTipText: {
    color: '#333',
    fontStyle: 'italic',
  },
});

export default HomeScreen;