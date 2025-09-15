import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { loginWithEmail } from "../config/firebase";
import { useGoogleAuth } from "../services/googleAuth";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogleAsync } = useGoogleAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("auth.errors.loginError"), t("auth.errors.fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error: any) {
      Alert.alert(t("auth.errors.loginError"), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogleAsync();
      if (!result.success) {
        Alert.alert(t("auth.errors.googleSignInError"), result.error);
      }
    } catch (error: any) {
      Alert.alert(t("auth.errors.googleSignInError"), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.containerDark]}>
      <View style={{ height: 220 }}>
        <LottieView
          source={require("../assets/CuteDoggie.json")}
          autoPlay
          loop
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: 200,
            alignSelf: "center",
          }}
        />
      </View>

      <Text style={[styles.title, isDark && styles.titleDark]}>{t("auth.welcome")}</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{t("auth.signInSubtitle")}</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder={t("auth.email")}
          placeholderTextColor={isDark ? "#94A3B8" : "#666"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder={t("auth.password")}
          placeholderTextColor={isDark ? "#94A3B8" : "#666"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("auth.signIn")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
          <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>{t("auth.or")}</Text>
          <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
        </View>

        <TouchableOpacity
          style={[styles.googleButton, isDark && styles.googleButtonDark, loading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={isDark ? "#fff" : "#333"} />
          ) : (
            <Text style={[styles.googleButtonText, isDark && styles.googleButtonTextDark]}>{t("auth.continueWithGoogle")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerLink}>
          <Text style={[styles.registerText, isDark && styles.registerTextDark]}>{t("auth.noAccount")} </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLinkText}>{t("auth.signUp")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  containerDark: {
    backgroundColor: "#0F172A",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  titleDark: {
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  subtitleDark: {
    color: "#94A3B8",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  inputDark: {
    backgroundColor: "#1E293B",
    borderColor: "#475569",
    color: "#F8FAFC",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerLineDark: {
    backgroundColor: "#475569",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#666",
    fontSize: 14,
  },
  dividerTextDark: {
    color: "#94A3B8",
  },
  googleButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleButtonDark: {
    backgroundColor: "#1E293B",
    borderColor: "#475569",
  },
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButtonTextDark: {
    color: "#F8FAFC",
  },
  registerLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerTextDark: {
    color: "#94A3B8",
  },
  registerLinkText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
