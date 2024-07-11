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
        const existingUser = users.find((user) => user.username === username);
        if (existingUser && existingUser.password === password) {
          setUser(existingUser);
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
        <View style={styles.usernameContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        </View>
        <View style={styles.passwordContainer}>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
          </View>
          <View style={styles.passwordIcon}>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loginButton}>
          <Button title={isLogin ? "Login" : "Register"} onPress={handleSubmit} />
        </View>

        {isLogin ? <View>
          <Text style={styles.switchText} onPress={() => setIsLogin(false)}>
            New to City Explorer? Register
          </Text>
          </View> : <View>
          <Text style={styles.switchText} onPress={() => setIsLogin(true)}>
            Already have an account? Login
          </Text>
          </View>
        }
        {userError.length > 0 ?<View>
          <Text style={styles.errorText}>{userError}</Text>
          </View>
         : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 40,
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
    color: "#56bf52",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    ...Platform.select({
      android: {
        width: "100%"
      }, web: {
        width: "100%",
      },
    }),
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "white"
  },
  passwordContainer: {
    ...Platform.select({
      android: {
        width: 200,
        flexDirection: "row",
      }, web: {
        width: 400,
        flexDirection: "row",
      },
    }),
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  passwordInput: {
    ...Platform.select({
      android: {
        width: "85%"
      }, web: {
        width: "93%"
  },
}),
  },
  usernameContainer: {
      ...Platform.select({
        android: {
          width: 200
        }, web: {
          width: 400,
        },
      }),
    flexDirection: "row",
    justifyContent: "center",
    margin: "auto",
  },
  eyeIcon: {
    fontSize: 20,
    marginLeft: 8,
    color: "#56bf52",
  },
  loginButton: {
    width: 200,
    margin: "auto"
  },
  switchText: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 12,
  },
});
export default LoginForm


