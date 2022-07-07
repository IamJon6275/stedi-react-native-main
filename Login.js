import {useState} from "react";
import { SafeAreaView, StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";

const sendText = async (phoneNumber) => {
  
  //using fetch do a POST to https://dev.stedi.me/twofactorlogin/
  const loginResponse = await fetch('https://dev.stedi.me/twofactorlogin/'+phoneNumber,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/text'
    }
  });
  const loginResponseText = await loginResponse.text();//converts the promise to a string by using await
  console.log('Login Response',loginResponseText);//print the response
};

const getToken = async({phoneNumber, oneTimePassword, setUserLoggedIn, setUserEmail}) => {//THIS CODE IS NOT COMPLETE JUST SHOWING HOW TO POST WITH A BODY
  const loginResponse=await fetch('https://dev.stedi.me/twofactorlogin', {
    method: 'POST',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify({
      phoneNumber,
      oneTimePassword
    })
  });
  const responseCode = loginResponse.status;
  if(responseCode==200){
    setUserLoggedIn(true);
    const token = await loginResponse.text();
    console.log(token);
    const emailResponse = await fetch("https://dev.stedi.me/validate/"+token);
    const textEmail = await emailResponse.text();
    setUserEmail(textEmail);
  }
}

const Login = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState(null);

  return (
    <SafeAreaView style={styles.mainView}>
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholder="801-555-1212"
        placeholderTextColor={'lightgray'}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{sendText(phoneNumber)}}
      >
        <Text>Send Text</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={setOneTimePassword}
        value={oneTimePassword}
        placeholder="1234"
        placeholderTextColor={'lightgray'}
        keyboardType="numeric"
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{getToken({phoneNumber, oneTimePassword, setUserLoggedIn:props.setUserLoggedIn, setUserEmail:props.setUserEmail})}}
      >
        <Text>Login</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  mainView: {
    marginTop:100,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 10,
    maxWidth: "25%",
  },
});

export default Login;