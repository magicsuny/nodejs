## v1.0.0 deploy
===

### 1 import wifi-list csv . run script:

````
mongoimport -h localhost -d leowifi -c wifis -f deviceId,date,time,msec,ssid,bssid,capabilities,level,frequency,password,keyMgmt,secLevel,eap,identity,otherSettings,latitude,longitude,accuracy,isRoot,country,admin_area_level_1,admin_area_level_2,admin_area_level_3 --ignoreBlanks --file ./wifi-list.csv --type csv
````

### 2 install graphicsmagick

```
sudo apt-get install graphicsmagick
```

### 3 set NODE_ENV
开发环境: NODE_ENV = development
预发布环境: NODE_ENV = staging
正式环境: NODE_ENV = production

### 3 put aws credentials
You need to set up your AWS security credentials before the sample code is able to connect to AWS. You can do this by creating a file named "credentials" at ~/.aws/