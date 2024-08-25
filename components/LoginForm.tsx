import React, { useContext, useState , useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform, Dimensions
} from "react-native";
import { AppContext } from "@/app/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import { getUsers, postUser } from "@/app/api";


const LoginForm = () => {
  const { setUser } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userError, setUserError] = useState("");
  const [styles, setStyles] = useState(calculateStyles());
  useEffect(() => {
      const onChange = ({window}) => {
        setStyles(calculateStyles(window.width));
      };
      const subscription = Dimensions.addEventListener('change', onChange);
  
      return () => {
        subscription?.remove();
      };
    }, []);
  function login(username, password) {
    setIsLoading(true)
    getUsers()
      .then(({ users }) => {
        setIsLoading(false)
        const existingUser = users.find((user) => user.username === username);
        if (existingUser && existingUser.password === password) {
          setUser(existingUser);
        } else {
          setUserError("Incorrect username or password");
        }
      })
      .catch((err) => {
        setIsLoading(false)
        console.error(err);
        throw err;
      });
  }

  function register(username, password) {
    if (username && password) {
      setIsLoading(true)
      getUsers()
        .then(({ users }) => {
          setIsLoading(false)
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
          setIsLoading(false)
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
        {isLogin ? null : <View style={styles.warningContainer}><Text style={styles.warning}>
          Warning: Please use a password that you do not use elsewhere while we work on implementing a more secure authentication system.</Text></View>}
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
          <Button title={isLogin ? "Login" : "Register"} onPress={handleSubmit} disabled={isLoading? true:false}/>
        </View>

        {isLoading ? 
        <View>
          <Text style={styles.loading}>Please be patient, our API is waking up...</Text>
        </View> : isLogin ? <View>
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

const calculateStyles = (screenWidth = Dimensions.get("window").width) => {
  const isSmallScreen = screenWidth < 550;
  const isLargeScreen = screenWidth >= 550;
  return StyleSheet.create({
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
      width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "white"
  },
  passwordContainer: {
    flexDirection: "row",
    width: isLargeScreen? 400: "80%"
  ,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  passwordInput: {
    width: isLargeScreen? "93%": "90%"

  },
  usernameContainer: {
    width: isLargeScreen? 400: "80%"
     ,
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
  loading: {
    textAlign: "center",
    marginTop: 12,
  },
  warning: {
    padding: 0,
    width: isLargeScreen? 400: "80%"
  ,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    margin: "auto"
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 12,
  },
});
}
export default LoginForm


