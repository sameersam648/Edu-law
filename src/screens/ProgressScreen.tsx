import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Svg, Circle, G, Text as SVGText } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';

interface ProgressScreenProps {
  initialProgress?: number;
  goal: string;
  milestones: string[];
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const windowWidth = Dimensions.get('window').width;

const ProgressScreen: React.FC<ProgressScreenProps> = ({ 
  initialProgress = 0.75, 
  goal = "Complete Project",
  milestones = ["Start", "25%", "50%", "75%", "Complete"]
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [showModal, setShowModal] = useState(false);
  const [progressHistory, setProgressHistory] = useState([initialProgress]);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const animatedValue = useRef(new Animated.Value(0)).current;
  const progressTextSlide = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const animateProgress = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 1500,
        easing: Easing.bounce,
        useNativeDriver: false,
      }),
      Animated.timing(progressTextSlide, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 1000,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [progress, animatedValue, progressTextSlide, subtitleFade]);

  useEffect(() => {
    animateProgress();
  }, [animateProgress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const handleNextMilestone = () => {
    const newProgress = Math.min(progress + 0.1, 1);
    setProgress(newProgress);
    setProgressHistory([...progressHistory, newProgress]);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const motivationalQuotes = useMemo(() => [
    "Every step counts!",
    "You're making great progress!",
    "Keep pushing, you're almost there!",
    "Success is just around the corner!",
    "You've got this!",
  ], []);

  const currentQuote = useMemo(() => 
    motivationalQuotes[Math.floor(progress * motivationalQuotes.length)],
    [progress, motivationalQuotes]
  );

  const renderMilestones = () => (
    <View style={styles.milestonesContainer}>
      {milestones.map((milestone, index) => (
        <View key={index} style={styles.milestoneItem}>
          <Icon 
            name={index <= progress * (milestones.length - 1) ? "check-circle" : "radio-button-unchecked"} 
            size={24} 
            color={theme.progressColor}
          />
          <Text style={[styles.milestoneText, { color: theme.textColor }]}>{milestone}</Text>
        </View>
      ))}
    </View>
  );

  const renderProgressChart = () => (
    <LineChart
      data={{
        labels: progressHistory.map((_, index) => `Day ${index + 1}`),
        datasets: [{
          data: progressHistory.map(p => p * 100)
        }]
      }}
      width={windowWidth - 40}
      height={220}
      chartConfig={{
        backgroundColor: theme.chartBackgroundColor,
        backgroundGradientFrom: theme.chartGradientFrom,
        backgroundGradientTo: theme.chartGradientTo,
        decimalPlaces: 0,
        color: (opacity = 1) => theme.chartLineColor,
        labelColor: (opacity = 1) => theme.chartLabelColor,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: theme.progressColor
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <LinearGradient colors={theme.gradientColors} style={styles.container}>
        <Text style={[styles.title, { color: theme.textColor }]}>{goal}</Text>

        <Svg height="150" width="150" viewBox="0 0 150 150">
          <G rotation="-90" origin="75, 75">
            <Circle
              cx="75"
              cy="75"
              r={radius}
              stroke={theme.circleBackgroundColor}
              strokeWidth={15}
              fill="none"
            />
            <AnimatedCircle
              cx="75"
              cy="75"
              r={radius}
              stroke={theme.progressColor}
              strokeWidth={15}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
          <SVGText
            x="75"
            y="75"
            fontSize="20"
            fill={theme.textColor}
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {`${(progress * 100).toFixed(0)}%`}
          </SVGText>
        </Svg>

        <Animated.Text
          style={[
            styles.progressText,
            {
              color: theme.progressColor,
              transform: [
                {
                  translateY: progressTextSlide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {currentQuote}
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleFade, color: theme.subtitleColor }]}>
          {progress < 1 ? "Keep going!" : "Congratulations! You've reached your goal!"}
        </Animated.Text>

        {renderMilestones()}

        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: theme.buttonColor }]}
          onPress={handleNextMilestone}
          disabled={progress >= 1}
        >
          <Text style={styles.ctaText}>
            {progress < 1 ? "Update Progress" : "Goal Completed!"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chartButton, { backgroundColor: theme.buttonColor }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.ctaText}>View Progress Chart</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalView}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Progress Chart</Text>
            {renderProgressChart()}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.buttonColor }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.ctaText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </ScrollView>
  );
};

const baseStyles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Avenir-Heavy',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  chartButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  milestonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  milestoneItem: {
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneText: {
    fontSize: 12,
    marginTop: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
});

const lightTheme = {
  gradientColors: ['#ffffff', '#f0f8ff'],
  textColor: '#2d2d2d',
  progressColor: '#4facfe',
  circleBackgroundColor: '#ececec',
  subtitleColor: '#7d7d7d',
  buttonColor: '#4facfe',
  chartBackgroundColor: '#ffffff',
  chartGradientFrom: '#ffffff',
  chartGradientTo: '#f0f8ff',
  chartLineColor: '#4facfe',
  chartLabelColor: '#2d2d2d',
};

const darkTheme = {
  gradientColors: ['#1a1a1a', '#2a2a2a'],
  textColor: '#ffffff',
  progressColor: '#6ac5fe',
  circleBackgroundColor: '#3a3a3a',
  subtitleColor: '#b0b0b0',
  buttonColor: '#6ac5fe',
  chartBackgroundColor: '#1a1a1a',
  chartGradientFrom: '#1a1a1a',
  chartGradientTo: '#2a2a2a',
  chartLineColor: '#6ac5fe',
  chartLabelColor: '#ffffff',
};

const styles = StyleSheet.create(baseStyles);

export default ProgressScreen;