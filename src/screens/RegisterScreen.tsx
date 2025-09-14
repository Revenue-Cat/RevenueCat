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
  Dimensions,
} from "react-native";
import { registerWithEmail } from "../config/firebase";
import { useGoogleAuth } from "../services/googleAuth";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogleAsync } = useGoogleAuth();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t("auth.errors.loginError"), t("auth.errors.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t("auth.errors.loginError"), t("auth.errors.passwordsDontMatch"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("auth.errors.loginError"), t("auth.errors.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password);
      Alert.alert(t("auth.errors.loginError"), t("auth.errors.accountCreated"), [
        { text: t("auth.errors.ok"), onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      Alert.alert(t("auth.errors.registrationError"), error.message);
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ height: 220 }}>
        <LottieView
          source={require("../assets/Loadercat.json")}
          autoPlay
          loop
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: 200,
            alignSelf: "center",
          }}
        />
      </View>
      <Text style={styles.title}>{t("auth.createAccount")}</Text>
      <Text style={styles.subtitle}>{t("auth.joinToday")}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder={t("auth.confirmPassword")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("auth.createAccount")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("auth.or")}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.googleButton, loading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.googleButtonText}>{t("auth.continueWithGoogle")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>{t("auth.hasAccount")} </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLinkText}>{t("auth.signIn")}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
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
  dividerText: {
    marginHorizontal: 15,
    color: "#666",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLinkText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;
