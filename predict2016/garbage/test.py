# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# from sklearn.cross_validation import train_test_split
# from sklearn import metrics
# import statsmodels.formula.api as smf
# from sklearn.metrics import classification_report

# # visualization
# import seaborn as sns
# import matplotlib.pyplot as plt
# import pickle


# df =  pd.read_csv('/Users/katethompson/Dev/ga/DAT-NYC-28/data/yelp.csv')

# print(df.head(5))
# print(df.shape)
# feature_cols = ['cool','useful','funny']
# X = df[feature_cols]
# y = df.stars

# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)

# linreg = LinearRegression()
# linreg.fit(X_train, y_train) #Fit the model with the training set





# print(linreg.coef_)
# print(linreg.predict([5,5,5]))
# print(linreg.predict([0,0,0]))

# from sklearn.externals import joblib
# joblib.dump(linreg, 'pickle.pkl') 


from sklearn import datasets
from sklearn.ensemble import RandomForestClassifier
from sklearn.cross_validation import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report

import pickle
import requests, json

iris = datasets.load_iris()
# print iris.DESCR
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
rfc = RandomForestClassifier(n_estimators=10)
rfc.fit(X_train,y_train)
print(y)
pickle.dump(rfc,open("python2pickle141.pkl","wb"))

with open("python2pickle141.pkl", 'rb') as f:
    d = pickle.load(f)
    print(classification_report(y_test,d.predict(X_test)))


with open("python2pickle141.pkl", 'rb') as f:
    d = pickle.load(f)
    print(d.predict_proba([1,1,1,1]))
    print(d.predict([1,1,1,1]))

