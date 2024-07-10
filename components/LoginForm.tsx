import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AppContext } from "@/app/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import { getUsers, postUser } from "@/app/api";

const LoginForm = () => {
  const { setUser } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userError, setUserError] = useState("");

  function login(username, password) {
    getUsers()
      .then(({ users }) => {
        console.log(users);
        const user = users.find((user) => user.username === username);
        if (user && user.password === password) {
          setUser(user);
        } else {
          setUserError("Incorrect username or password");
        }
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  function register(username, password) {
    if (username && password) {
      getUsers()
        .then(({ users }) => {
          const user = users.find((user) => user.username === username);
          if (user) {
            setUserError("Username already exists");
            return;
          }
          postUser(username, password).then((user) => {
            login(username, password);
          });
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  }
  const handleSubmit = () => {
    if (isLogin) {
      login(username, password);
    } else {
      register(username, password);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View>
        <FontAwesome name="user-circle" style={styles.avatar} />
        <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <Button title={isLogin ? "Login" : "Register"} onPress={handleSubmit} />
        {isLogin ? (
          <Text style={styles.switchText} onPress={() => setIsLogin(false)}>
            New to City Explorer? Register
          </Text>
        ) : (
          <Text style={styles.switchText} onPress={() => setIsLogin(true)}>
            Already have an account? Login
          </Text>
        )}
        {userError.length > 0 ? (
          <Text style={styles.errorText}>{userError}</Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "",
  },
  avatar: {
    fontSize: 100,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  switchText: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 12,
  },
});

export default LoginForm;
