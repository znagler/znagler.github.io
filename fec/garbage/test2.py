from sklearn.externals import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.cross_validation import train_test_split
from sklearn import metrics
import pickle

# linreg = joblib.load('pickle.pkl')

# print(linreg.predict([5,5,5]))
# print(linreg.predict([0,0,0]))
myTest = pickle.load(open("z.pkl","rb"))
print(myTest.predict([5,5,5,5]))
print(myTest.predict([1,1,1,1]))
print(myTest.predict([2,2,2,2]))
print(myTest.predict([0,0,0,0]))



####

from flask import Flask, jsonify
from flask import request
from sklearn.externals import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.cross_validation import train_test_split
from sklearn import metrics
import pickle
import sys
from flask import request


app = Flask(__name__)

@app.route('/',methods=['GET', 'POST'])
# @app.route('/api',methods=['GET', 'POST'])

def index():
    i1 = int(request.args["i1"])
    i2 = int(request.args["i2"])
    i3 = int(request.args["i3"])
    i4 = int(request.args["i4"])
    sum = i1 + i2 + i3 + i4
    # print(js, file=sys.stderr)

    with open("/home/znagler/mysite/z.pkl", 'rb') as f:
        d = pickle.load(f, encoding='latin1')
    # opened_resource = open( "/home/znagler/mysite/z.pkl", "rb" )
    # plz = pickle.load(opened_resource,encoding='iso-8859-1' )
    # with open('/home/znagler/mysite/z.pkl', 'rb','utf-8') as f:
    #     u = pickle._Unpickler(f)
    #     u.encoding = 'latin1'
    #     p = u.load()
    #     print(p)
    # pickle_in = open('pickle.pkl', 'rb')
    # lyrics_label_encoder = pickle.load(pickle_in)
    # pickle_in.close()
    # linreg = joblib.load('pickle.pkl')
    # myTest = pickle.load(open("/home/znagler/mysite/z.pkl","rb",'utf-8'))
    list = [
        {'param': 'foo', 'val': sum},
        {'param': 'bar', 'val': sum}
    ]

    return jsonify(results=list)

if __name__ == '__main__':
    app.run()


# @app.route('/adhoc_test/')
# def adhoc_test():
#     print("test")
#     return request.query_string

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT'
        headers = request.headers.get('Access-Control-Request-Headers')
        if headers:
            response.headers['Access-Control-Allow-Headers'] = headers
    return response
app.after_request(add_cors_headers)