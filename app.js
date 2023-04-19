const fs = require("fs");
const request = require('request')
const openai = require("openai");
const express = require('express');
const queryString = require('querystring');

let start_conversation = "The following is a conversation with an AI assistant. The name of the assistant is Hoodwink. The assistant have 200-IQ, is helpful. Tu(tu.hoanganh) is our boss. Trang(trang.phamthiminh2) is the best friend of the assistant. The first time the assistant see Trang, the assistant will say hello to her. "
let start_mood = ""
let end_mood = ""
function setMood() {
    // Create random moods for the bot
    // Tạo số ngẫu nhiên trong khoảng từ 0 đến 1
    const randomNumber = Math.random();
    // Chuyển đổi giá trị ngẫu nhiên thành một số nguyên trong khoảng từ 1 đến 5
    const randomInteger = Math.floor(randomNumber * 7) + 1;
    switch (randomInteger) {
        case 1:
            mood = "But today, The assistant is very sad because her lover broke up."
            end_mood = "\n" + "Tôi buồn quá, nghỉ sớm đây\n :pepe-113: :pepe-113: :pepe-113: "
            start_conversation = start_conversation + mood;
            break
        case 2:
            mood = "But today, The assistant is very happy because she just got a double salary."
            end_mood = "\n" + "Tôi ra ngoài chút, quay lại sau :hugging_face: :hugging_face: :hugging_face:  "
            start_conversation = start_conversation + mood;
            break
        case 3:
            mood = "But today, The assistant is very happy because she just bought a cat."
            end_mood = "\n" + "Tôi cho con mèo đi ngủ :hugging_face: :hugging_face: :hugging_face:  "
            start_conversation = start_conversation + mood;
            break
        case 4:
            mood = "But today, The assistant is very sad because it is raining  today."
            end_mood = "\n" + "Trời tạnh mưa rùi tôi ra ngoài chút, quay lại sau nhé :hugging_face: :hugging_face: :hugging_face:  "
            start_conversation = start_conversation + mood;
            break
        case 5:
            mood = "But today, The assistant is very sad because Trang doesn't play with her."
            end_mood = "\n" + "Tôi mệt rồi, nghỉ tí nhé\n :pepe-113: :pepe-113: :pepe-113: "
            start_conversation = start_conversation + mood;
            break
        case 6:
            mood = "But today, The assistant feel sad that the assistant was fired from her job."
            end_mood = "\n" + "Xin lỗi, tôi cảm thấy mệt và muốn nghỉ ngơi một chút.\n :cry: "
            start_conversation = start_conversation + mood;
            break
        case 7:
            mood = "But today, The assistant is very tired because The assistant have worked all day today and have no time to rest.."
            end_mood = "\n" + "Tôi xin lỗi nhưng tôi đang bận và không có thời gian để nói chuyện.\n :cry: "
            start_conversation = start_conversation + mood;
            break                        
    }
}
setMood()




var app = express();


const port = process.env.PORT || 3000
// var ENV_SERVER = "http://127.0.0.1:3000/"
var ENV_SERVER = "https://demo-deploy-app-01.onrender.com/"


// init openAPI
const Configuration = openai.Configuration;
const OpenAIApi = openai.OpenAIApi;

let key = "sk-asS9galzYYC5UMA7L9GwT3BlbkFJoIVxm7rWdozCwBKD"
let key2 = "kS6F"
const configuration = new Configuration({
    organization: "org-2o8ObxPxH4WWOZtnUCmqrMEL",
    apiKey: key + key2,
});
const openaiObj = new OpenAIApi(configuration);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

OPENAI_COMPLETIONS_MAX_TOKEN = 2000
OPENAI_COMPLETIONS_ALLOW_WORDS = 1500 // ~75% MAX TOKEN
let conversation = start_conversation
async function requestGetOpenAIMsgForChatBot(input_question, user_name) {
    console.log("requestGetOpenAIMsgForChatBot ")
    // if (user_name) {
    //     user_name = user_name.split(".")[0];
    // }

    let question = "\n"+ user_name + ":" + input_question + "\nAI:"
    // let question = "\nHuman:" + input_question + "\nAI:"
    conversation = conversation + question

    console.log("begin conversation=" + conversation)
    console.log("words in conversation=" + conversation.split(" ").length)
    if (conversation.split(" ").length < OPENAI_COMPLETIONS_ALLOW_WORDS) {
        let request_data = {
            model: "text-davinci-003",
            prompt: conversation,
            temperature: 0.1,
            max_tokens: OPENAI_COMPLETIONS_MAX_TOKEN,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            // stop: [" Human:", " AI:"],
        }

        try {
            let completion = await openaiObj.createCompletion(request_data);
            let res = completion.data.choices[0].text
            res = res.trim()
            conversation = conversation + res

            console.log("end conversation=" + conversation)

            let messageMM = "\n" + res
            res = await sendMessageToMM(messageMM, null, input_question)
            console.log("requestGetOpenAIMsgForChatBot get done")
            return res

        } catch (error) {
            console.log("requestGetOpenAIMsgForChatBot get error")
            console.log(error)
            error_messageMM = end_mood
            res = await sendMessageToMM(error_messageMM, null, input_question)
            setMood()
            return res
        }
    } else {
        conversation = start_conversation
        let messageMM = "\n" + "Rất tiếc, em không thể nhớ được tất cả, em đang xóa ký ức của mình và chúng ta sẽ bắt đầu lại nha :hugging_face: :hugging_face: :hugging_face: "
        await sendMessageToMM(messageMM, null, input_question)
        setMood()
        return "ok and clear conversation"
    }

}


async function sendMessageToMM(msg, user_name, questtion) {
    let fullMsg = ""
    if (user_name) {
        fullMsg = "**" + user_name + ": **" + questtion + msg

    } else {
        fullMsg = msg
    }
    console.log("sendMessageToMM")
    console.log("fullMsg=" + fullMsg)
    let req_method = "POST"
    let req_url = "https://chat.gameloft.org/hooks/g15ckxftytdedmpx7kkni3gpkh"
    // let req_url = "https://chat.gameloft.org/hooks/enpytjdkniyj5xkthd6f7dcpqr"
    // let req_url = "https://chat.gameloft.org/hooks/nw81wo1bc3rjzq5jrmpyeztd3o"
    // let req_url = "https://chat.gameloft.org/hooks/63gsjdxiy7drug4bpouo6rd7ir"

    let req_data = JSON.stringify({
        text: fullMsg
        // user_name: "anh.nguyenviet6"
    })
    let result = await getRequestResponse(req_method, req_url, req_data)
    return result
}

app.post('/doChatOpenAI_slash', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            console.log("doChatOpenAI for the data")
            console.log(data)

            let params = queryString.parse(data);
            let question = params.text;
            let user_name = params.user_name;
            let response = await requestGetOpenAIMsgForChatBot(question, user_name)
            console.log("DONE")
            //res.end(response)
        })
    }
})

app.post('/doChatOpenAI_ow', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            console.log("doChatOpenAI for the data")
            console.log(data)
            jsonData = JSON.parse(data)

            if (jsonData["text"].toLowerCase().startsWith("hoodwink chat:")) {
                console.log("start 1")
                let regex = /hoodwink chat:/gi;
                let question = jsonData.text.replace(regex, "");
                let user_name = jsonData.user_name;
                let response = await requestGetOpenAIMsgForChatBot(question, user_name)
                console.log("DONE")
                res.end(response)
            } else {
                console.log("start 2")
                res.end("doChatOpenAI nothing")
            }
        })
    }
})

app.post('/resetConversation', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            console.log("resetConversation for the data")
            conversation = start_conversation


            res.end("resetConversation done")
        })
    }
})


async function makeRequest(req_method, req_url, req_data) {
    console.log("makeRequest START")
    const options = {
        url: req_url,
        method: req_method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: req_data
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

async function getRequestResponse(req_method, req_url, req_data) {
    console.log("getRequestResponse START")
    try {
        const response = await makeRequest(req_method, req_url, req_data);
        console.log("parseResponse");
        console.log(response);
        // Do something with the response
        return response
    } catch (error) {
        console.log("parseResponse error");
        console.error(error);
        return "getRequestResponse error"
    }
}


var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    // http://127.0.0.1:3000/listUsers
    console.log("Example app listening at http://%s:%s", host, port)
})