import requests
import sys

data = {}
# data["text"] = 'OpenAI Chat: Có x con chó 4 chân và y con gà 2 chân, có tổng cộng 36 con và tổng cộng có 100 cái chân. Hỏi có bao nhiêu con gà bao nhiêu con chó? '
# data["text"] = 'OpenAI Chat: Bạn tính thế nào vậy'
# data["text"] = 'OpenAI Chat: Bạn tính sai rồi, đáp án là 16 con chó và 18 con gà'
# data["text"] = 'OpenAI Chat: bạn sai ở đây này 144 - 4y + 2y = 100, tại sao y lại bằng 11'
# data["text"] = 'OpenAI Chat: tôi tính ra y = 22'
# data["text"] = 'OpenAI Chat: bạn mới sai tính lại đi, 144 - 4y + 2y = 144 - 2y => y = 22'
data["text"] = 'OpenAI Chat: youre trained to kiss ass man'
data["user_name"] = "anh.nguyenviet6"
myobj = data

url = 'http://127.0.0.1:3000/doChatOpenAI_ow'

x = requests.post(url, json = myobj)

print(x.text)