import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const DEFAULT_CARDS = [
  { id: "1", question: "What does HTML stand for?", answer: "HyperText Markup Language" },
  { id: "2", question: "What is CSS used for?", answer: "Styling and designing web pages" },
  { id: "3", question: "What does API stand for?", answer: "Application Programming Interface" },
  { id: "4", question: "What is JavaScript?", answer: "A programming language commonly used to make web pages interactive" }
];

const QUOTES = [
  ["The secret of getting ahead is getting started.", "Mark Twain"],
  ["Success is the sum of small efforts, repeated day in and day out.", "Robert Collier"],
  ["It always seems impossible until it's done.", "Nelson Mandela"],
  ["Great things are done by a series of small things brought together.", "Vincent van Gogh"],
  ["Dream big and dare to fail.", "Norman Vincent Peale"],
  ["The future depends on what you do today.", "Mahatma Gandhi"],
  ["Believe you can and you're halfway there.", "Theodore Roosevelt"],
  ["Start where you are. Use what you have. Do what you can.", "Arthur Ashe"]
];

const KEY = {
  cards: "@codealpha_cards",
  fitness: "@codealpha_fitness"
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [quote, setQuote] = useState(QUOTES[0]);
  const [fitness, setFitness] = useState({
    steps: 0,
    workoutMinutes: 0,
    calories: 0,
    logs: []
  });

  useEffect(() => {
    (async () => {
      try {
        const savedCards = await AsyncStorage.getItem(KEY.cards);
        const savedFitness = await AsyncStorage.getItem(KEY.fitness);
        if (savedCards) setCards(JSON.parse(savedCards));
        if (savedFitness) setFitness(JSON.parse(savedFitness));
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(KEY.cards, JSON.stringify(cards)).catch(() => {});
  }, [cards]);

  useEffect(() => {
    AsyncStorage.setItem(KEY.fitness, JSON.stringify(fitness)).catch(() => {});
  }, [fitness]);

  const currentCard = cards[cardIndex] || cards[0];

  const randomQuote = () => {
    let next = Math.floor(Math.random() * QUOTES.length);
    if (QUOTES.length > 1 && QUOTES[next][0] === quote[0]) {
      next = (next + 1) % QUOTES.length;
    }
    setQuote(QUOTES[next]);
  };

  const openAdd = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setScreen("cardForm");
  };

  const openEdit = () => {
    if (!currentCard) return;
    setEditingId(currentCard.id);
    setQuestion(currentCard.question);
    setAnswer(currentCard.answer);
    setScreen("cardForm");
  };

  const saveCard = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Missing details", "Enter both question and answer.");
      return;
    }
    if (editingId) {
      setCards(cards.map(c =>
        c.id === editingId ? { ...c, question: question.trim(), answer: answer.trim() } : c
      ));
    } else {
      setCards([...cards, { id: Date.now().toString(), question: question.trim(), answer: answer.trim() }]);
      setCardIndex(cards.length);
    }
    setQuestion("");
    setAnswer("");
    setEditingId(null);
    setShowAnswer(false);
    setScreen("flashcards");
  };

  const deleteCard = () => {
    if (!currentCard) return;
    Alert.alert("Delete flashcard", "Delete this flashcard?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const next = cards.filter(c => c.id !== currentCard.id);
          setCards(next.length ? next : DEFAULT_CARDS);
          setCardIndex(Math.max(0, Math.min(cardIndex, next.length - 1)));
          setShowAnswer(false);
        }
      }
    ]);
  };

  const addFitness = () => {
    const steps = Number(fitness._steps || 0);
    const workoutMinutes = Number(fitness._workout || 0);
    const calories = Number(fitness._calories || 0);

    if (!steps && !workoutMinutes && !calories) {
      Alert.alert("Add activity", "Enter at least one fitness value.");
      return;
    }

    const today = new Date().toLocaleDateString();
    setFitness(prev => ({
      steps: prev.steps + steps,
      workoutMinutes: prev.workoutMinutes + workoutMinutes,
      calories: prev.calories + calories,
      logs: [
        ...prev.logs,
        { id: Date.now().toString(), date: today, steps, workoutMinutes, calories }
      ].slice(-7),
      _steps: 0,
      _workout: 0,
      _calories: 0
    }));
  };

  const resetFitness = () => {
    Alert.alert("Reset progress", "Clear today's stored fitness summary?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => setFitness({ steps: 0, workoutMinutes: 0, calories: 0, logs: [] })
      }
    ]);
  };

  const NavButton = ({ icon, label, value }) => (
    <TouchableOpacity
      style={[styles.navItem, screen === value && styles.navItemActive]}
      onPress={() => setScreen(value)}
    >
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={[styles.navText, screen === value && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const Header = ({ title, subtitle }) => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {screen !== "home" && (
        <TouchableOpacity onPress={() => setScreen("home")} style={styles.homeMini}>
          <Text style={styles.homeMiniText}>⌂</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const Home = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.badge}>CODEALPHA • APP DEVELOPMENT</Text>
        <Text style={styles.heroTitle}>Learn. Track. Grow.</Text>
        <Text style={styles.heroSub}>
          A clean mobile app containing three completed CodeAlpha internship tasks.
        </Text>
      </View>

      <TouchableOpacity style={styles.taskCard} onPress={() => setScreen("flashcards")}>
        <Text style={styles.taskNumber}>TASK 1</Text>
        <Text style={styles.taskTitle}>Flashcard Quiz App</Text>
        <Text style={styles.taskDesc}>Study questions, reveal answers, navigate cards, and manage your own flashcards.</Text>
        <Text style={styles.openText}>Open task →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.taskCard} onPress={() => setScreen("quotes")}>
        <Text style={styles.taskNumber}>TASK 2</Text>
        <Text style={styles.taskTitle}>Random Quote Generator</Text>
        <Text style={styles.taskDesc}>Generate a different quote with author information whenever you tap the button.</Text>
        <Text style={styles.openText}>Open task →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.taskCard} onPress={() => setScreen("fitness")}>
        <Text style={styles.taskNumber}>TASK 3</Text>
        <Text style={styles.taskTitle}>Fitness Tracker</Text>
        <Text style={styles.taskDesc}>Log steps, workouts and calories with a simple progress dashboard and local storage.</Text>
        <Text style={styles.openText}>Open task →</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Built for submission</Text>
        <Text style={styles.infoText}>React Native + Expo • Local data storage • Responsive mobile UI</Text>
      </View>
    </ScrollView>
  );

  const Flashcards = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Flashcard Quiz" subtitle={`${cards.length} cards available`} />

      <View style={styles.flashCard}>
        <Text style={styles.smallLabel}>QUESTION</Text>
        <Text style={styles.question}>{currentCard?.question || "No cards available"}</Text>
        {showAnswer && (
          <View style={styles.answerBox}>
            <Text style={styles.smallLabel}>ANSWER</Text>
            <Text style={styles.answer}>{currentCard?.answer}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.primaryText}>{showAnswer ? "Hide Answer" : "Show Answer"}</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.secondaryButton, cardIndex === 0 && styles.disabled]}
          disabled={cardIndex === 0}
          onPress={() => { setCardIndex(cardIndex - 1); setShowAnswer(false); }}
        >
          <Text style={styles.secondaryText}>← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, cardIndex >= cards.length - 1 && styles.disabled]}
          disabled={cardIndex >= cards.length - 1}
          onPress={() => { setCardIndex(cardIndex + 1); setShowAnswer(false); }}
        >
          <Text style={styles.secondaryText}>Next →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.outlineButton} onPress={openAdd}>
          <Text style={styles.outlineText}>＋ Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} onPress={openEdit}>
          <Text style={styles.outlineText}>✎ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteCard}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>Card {cards.length ? cardIndex + 1 : 0} / {cards.length}</Text>
    </ScrollView>
  );

  const CardForm = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title={editingId ? "Edit Flashcard" : "Add Flashcard"} />
      <Text style={styles.inputLabel}>Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your question"
        value={question}
        onChangeText={setQuestion}
        multiline
      />
      <Text style={styles.inputLabel}>Answer</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Enter the answer"
        value={answer}
        onChangeText={setAnswer}
        multiline
      />
      <TouchableOpacity style={styles.primaryButton} onPress={saveCard}>
        <Text style={styles.primaryText}>{editingId ? "Update Flashcard" : "Save Flashcard"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setScreen("flashcards")}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const Quotes = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Random Quotes" subtitle="A little motivation, one tap away" />
      <View style={styles.quoteCard}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quoteText}>{quote[0]}</Text>
        <Text style={styles.author}>— {quote[1]}</Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={randomQuote}>
        <Text style={styles.primaryText}>✨ New Quote</Text>
      </TouchableOpacity>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>Quotes are selected from a built-in collection, so the app works without an API key or internet connection.</Text>
      </View>
    </ScrollView>
  );

  const Fitness = () => {
    const max = Math.max(1, ...fitness.logs.map(x => x.steps), 5000);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Fitness Tracker" subtitle="Your activity dashboard" />

        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statValue}>{fitness.steps}</Text><Text style={styles.statLabel}>Steps</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>{fitness.workoutMinutes}</Text><Text style={styles.statLabel}>Minutes</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>{fitness.calories}</Text><Text style={styles.statLabel}>Calories</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log today's activity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Steps"
            value={String(fitness._steps ?? "")}
            onChangeText={v => setFitness({...fitness, _steps: v.replace(/[^0-9]/g, "")})}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Workout minutes"
            value={String(fitness._workout ?? "")}
            onChangeText={v => setFitness({...fitness, _workout: v.replace(/[^0-9]/g, "")})}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Calories burned"
            value={String(fitness._calories ?? "")}
            onChangeText={v => setFitness({...fitness, _calories: v.replace(/[^0-9]/g, "")})}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={addFitness}>
            <Text style={styles.primaryText}>＋ Add Activity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent step progress</Text>
          {fitness.logs.length === 0 ? (
            <Text style={styles.empty}>No activity logged yet.</Text>
          ) : (
            fitness.logs.map(log => (
              <View key={log.id} style={styles.progressItem}>
                <View style={styles.progressTop}>
                  <Text style={styles.progressDate}>{log.date}</Text>
                  <Text style={styles.progressValue}>{log.steps} steps</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.min(100, (log.steps / max) * 100)}%` }]} />
                </View>
                <Text style={styles.logMeta}>{log.workoutMinutes} min workout • {log.calories} kcal</Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={resetFitness}>
          <Text style={styles.cancelText}>Reset Fitness Data</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        {screen === "home" && <Home />}
        {screen === "flashcards" && <Flashcards />}
        {screen === "cardForm" && <CardForm />}
        {screen === "quotes" && <Quotes />}
        {screen === "fitness" && <Fitness />}

        <View style={styles.bottomNav}>
          <NavButton icon="⌂" label="Home" value="home" />
          <NavButton icon="▣" label="Cards" value="flashcards" />
          <NavButton icon="❝" label="Quotes" value="quotes" />
          <NavButton icon="♡" label="Fitness" value="fitness" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FC" },
  app: { flex: 1 },
  container: { padding: 20, paddingBottom: 110 },
  hero: { backgroundColor: "#111827", borderRadius: 24, padding: 24, marginBottom: 18 },
  badge: { color: "#A5B4FC", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  heroTitle: { color: "#fff", fontSize: 31, fontWeight: "900", marginTop: 12 },
  heroSub: { color: "#D1D5DB", fontSize: 14, lineHeight: 21, marginTop: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 27, fontWeight: "900", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  homeMini: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  homeMiniText: { fontSize: 22, color: "#111827" },
  taskCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: "#E5E7EB" },
  taskNumber: { fontSize: 11, fontWeight: "900", color: "#6366F1", letterSpacing: 1 },
  taskTitle: { fontSize: 20, fontWeight: "800", color: "#111827", marginTop: 7 },
  taskDesc: { fontSize: 13, color: "#6B7280", lineHeight: 19, marginTop: 7 },
  openText: { fontSize: 13, fontWeight: "800", color: "#4F46E5", marginTop: 14 },
  infoBox: { backgroundColor: "#EEF2FF", borderRadius: 18, padding: 18, marginTop: 6 },
  infoTitle: { fontWeight: "800", color: "#312E81", fontSize: 15 },
  infoText: { color: "#4B5563", fontSize: 13, lineHeight: 19, marginTop: 5 },
  flashCard: { backgroundColor: "#fff", minHeight: 270, borderRadius: 24, padding: 24, justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  smallLabel: { fontSize: 10, fontWeight: "900", color: "#6366F1", letterSpacing: 1 },
  question: { fontSize: 24, fontWeight: "800", color: "#111827", lineHeight: 32, marginTop: 10 },
  answerBox: { marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  answer: { fontSize: 17, color: "#374151", lineHeight: 25, marginTop: 8 },
  primaryButton: { backgroundColor: "#111827", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 14 },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  secondaryButton: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#D1D5DB", padding: 14, borderRadius: 14, alignItems: "center", marginTop: 12 },
  secondaryText: { color: "#111827", fontWeight: "700" },
  row: { flexDirection: "row", gap: 10 },
  disabled: { opacity: 0.4 },
  outlineButton: { flex: 1, borderWidth: 1, borderColor: "#6366F1", padding: 13, borderRadius: 14, alignItems: "center", marginTop: 12 },
  outlineText: { color: "#4F46E5", fontWeight: "800" },
  deleteButton: { flex: 1, borderWidth: 1, borderColor: "#FCA5A5", padding: 13, borderRadius: 14, alignItems: "center", marginTop: 12 },
  deleteText: { color: "#DC2626", fontWeight: "800" },
  counter: { textAlign: "center", color: "#6B7280", marginTop: 14, fontSize: 12 },
  inputLabel: { fontSize: 13, fontWeight: "800", color: "#374151", marginBottom: 7, marginTop: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 14, padding: 14, fontSize: 15, marginBottom: 10, color: "#111827" },
  largeInput: { minHeight: 130, textAlignVertical: "top" },
  cancelButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D1D5DB", padding: 15, borderRadius: 14, alignItems: "center", marginTop: 12 },
  cancelText: { color: "#374151", fontWeight: "800" },
  quoteCard: { backgroundColor: "#111827", borderRadius: 25, padding: 26, minHeight: 320, justifyContent: "center" },
  quoteMark: { fontSize: 70, color: "#A5B4FC", lineHeight: 70, height: 62 },
  quoteText: { color: "#fff", fontSize: 25, fontWeight: "800", lineHeight: 34, marginTop: 8 },
  author: { color: "#C7D2FE", fontSize: 14, marginTop: 20, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 9, marginBottom: 14 },
  stat: { flex: 1, backgroundColor: "#fff", borderRadius: 17, padding: 15, borderWidth: 1, borderColor: "#E5E7EB" },
  statValue: { fontSize: 21, fontWeight: "900", color: "#111827" },
  statLabel: { fontSize: 11, color: "#6B7280", marginTop: 3 },
  section: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: "#E5E7EB" },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111827", marginBottom: 12 },
  empty: { color: "#6B7280", fontSize: 13 },
  progressItem: { marginBottom: 15 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressDate: { fontSize: 12, fontWeight: "700", color: "#374151" },
  progressValue: { fontSize: 12, fontWeight: "800", color: "#4F46E5" },
  progressTrack: { height: 9, backgroundColor: "#E5E7EB", borderRadius: 9, overflow: "hidden" },
  progressFill: { height: 9, backgroundColor: "#6366F1", borderRadius: 9 },
  logMeta: { fontSize: 11, color: "#6B7280", marginTop: 5 },
  bottomNav: { position: "absolute", left: 12, right: 12, bottom: 12, height: 68, backgroundColor: "#fff", borderRadius: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderWidth: 1, borderColor: "#E5E7EB" },
  navItem: { alignItems: "center", justifyContent: "center", width: "24%", height: 58, borderRadius: 16 },
  navItemActive: { backgroundColor: "#EEF2FF" },
  navIcon: { fontSize: 19, color: "#6B7280" },
  navText: { fontSize: 10, color: "#6B7280", marginTop: 3, fontWeight: "700" },
  navTextActive: { color: "#4F46E5" }
});
