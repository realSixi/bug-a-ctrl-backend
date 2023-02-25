# BugACtrl


## Interne Verwendung
_nur zu Dokumentationszwecken_

### MQTT Nachrichten

#### Topic `bugactrl/switchtime/`

##### Steuern des Baggers

```json
{
  "created" : "2023-10-05T14:48:00.000Z",
  "user_id" : 9998777,
  "username": "realSixi",
  "joint_a": 0,
  "joint_b": 1000,
  "joint_c": 500,
  "vertical_axis": 0
}
```


#### Topic `bugactrl/control/`

##### Zeit "kaufen" 

```json
{
  "created" : "2023-10-05T14:48:00.000Z",
  "type": "BUY_TIME",
  "transaction_id": 12345,
  "user_id" : 9998877,
  "duration": "PT5M"
}
```


##### Status

```json
{
  "created" : "2023-10-05T14:48:00.000Z",
  "type": "STATUS",
  "is_available": true
}
```
