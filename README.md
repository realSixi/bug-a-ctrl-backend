# BugACtrl


## Interne Verwendung
_nur zu Dokumentationszwecken_

### MQTT Nachrichten

#### Topic `bugactrl/switchtime/`

##### Steuern des Baggers

```json
{
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
  "type": "BUY_TIME",
  "transaction_id": 12345,
  "user_id" : 9998877,
  "duration": "PT5M"
}
```


##### Status

```json
{
  "type": "STATUS",
  "is_available": true
}
```
