import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from 'react-native-config';

interface ApiResponse {
  content: string;
  error?: string;
}

const AskmeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
  
    setIsLoading(true);
    setApiResponse(null);
  
    try {
      console.log('Attempting to fetch from Groq API...');
      console.log('API Key:', Config.GROQ_API_KEY ? 'Present' : 'Missing');
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Config.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: searchQuery }],
        }),
      });
  
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API response received:', data);
  
      setApiResponse({ content: data.choices[0].message.content });
      updateSearchHistory(searchQuery);
    } catch (error) {
      console.error('Detailed error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      setApiResponse({ content: '', error: 'Error fetching response. Please check console for details.' });
    } finally {
      setIsLoading(false);
      setSearchQuery('');
    }
  };
  
  const updateSearchHistory = (query: string) => {
    if (!searchHistory.includes(query)) {
      setSearchHistory(prevHistory => [query, ...prevHistory]);
    }
  };

  const handleSelectHistory = (item: string) => {
    setSearchQuery(item);
    setShowHistory(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const clearResponse = () => {
    setApiResponse(null);
  };

  return (
    <View style={styles.container}>
      {/* Top Section: Menu Icon */}
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={() => setShowHistory(true)}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Middle Content */}
      <View style={styles.middleContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : apiResponse ? (
          <>
            <Text style={apiResponse.error ? styles.errorText : styles.responseText}>
              {apiResponse.error || apiResponse.content}
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearResponse}>
              <Text style={styles.clearButtonText}>Clear Response</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.middleText}>Start searching legal topics or ask me anything!</Text>
        )}
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for legal topics..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} disabled={isLoading}>
          <Icon name="search" size={28} color={isLoading ? "#888" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Modal for Search History */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search History</Text>

            {searchHistory.length > 0 ? (
              <>
                <FlatList
                  data={searchHistory}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectHistory(item)}>
                      <Text style={styles.historyItem}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity onPress={clearSearchHistory} style={styles.clearHistoryButton}>
                  <Text style={styles.clearHistoryButtonText}>Clear History</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noHistoryText}>No search history available</Text>
            )}

            <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  middleText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#000',
  },
  noHistoryText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#007bff',
    textAlign: 'center',
  },
  clearHistoryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  clearHistoryButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AskmeScreen;