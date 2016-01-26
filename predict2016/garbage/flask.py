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

    print >>sys.stderr, pickle
    print >>sys.stderr, "912"
    i1 = int(request.args["i1"])
    i2 = int(request.args["i2"])
    i3 = int(request.args["i3"])
    i4 = int(request.args["i4"])
    sum = i1 + i2 + i3 + i4
    with open("/home/znagler/mysite/python2pickle141.pkl", 'rb') as f:
        d = pickle.load(f)
    # linreg = joblib.load("/home/znagler/mysite/z.pkl")

        # try:
        #     obj = pickle.load(f)
        # except Exception as e:
        #     print >>sys.stderr, e
        #     position = f.tell()
        #     a = foo.__getinitargs__
        #     del foo.__getinitargs__
        #     f.seek(position)
        #     obj = pickle.load(f)
        #     foo.__getinitargs__ = a

    # with open("/home/znagler/mysite/z.pkl", 'rb') as f:
    #     d = pickle.load(f, encoding='latin1')
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