# AthenaVehicleDealerShip

![image](https://user-images.githubusercontent.com/82890183/132778013-76c971fa-657b-4458-9233-23466d326d74.png)
![image](https://user-images.githubusercontent.com/82890183/132778372-38b29787-e52f-4ba8-b036-a2af74e05417.png)

## SETUP
This is a server & clientside plugin. So you will have to take care of both imports by yourself.
- Drag Serverside Content (vehicledealer/index) into /src/core/plugins
- Drag Clientside Content (vehicledealer/index) into /src/core/client-plugins

Serverside Imports:
```typescript 
'./vehicledealer/index',
```
Clientside Imports: 
````typescript
import './vehicledealer/index';
````

## FEATURES
- Non Hologram Vehicle Dealer
- Vehicles are freezed & undestroyable
- /vehpos Command to get correct vehicle positions
- Players can Interact with Vehicles which will open an inputmenu to buy the vehicle which they are before.
- Nice sweet Textlabels
- Based on Athenas Interaction Controller
- Using Athena's Dealership Purchase Function so vehicles will be spawned on the garage

## ATHENA CONFIGURATION 
- If you skip that part created vehicles will have lock icons and stuff about them and you may encounter some weird stuff. You'll have to search yourself for the correct lines.

src/core/server/extensions/vehicleFuncs.ts
```typescript
// Used to skip keys for a vehicle.
// Used for checking ownership while ignoring keys.
if (vehicle.behavior == Vehicle_Behavior.NO_SAVE) return false;
```

src/core/client/systems/interaction.ts
```typescript
if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.OWNER) != "dealership") {
  if (isVehicleLocked) 
  {
    drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
  } else {
    drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
  }
}
                
if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.OWNER) != "dealership") {
  const lockText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_LOCK);
  interactText = InteractionController.appendText(interactText, KEY_BINDS.VEHICLE_LOCK, lockText);
}
```


## SERVERSIDE-CONFIGURATION

```typescript
// Setup for spawned vehicle Dealer Cars
const dealerCarPrimaryColor = new alt.RGBA(255, 255, 255, 255);
const dealerCarSecondaryColor = new alt.RGBA(255, 255, 255, 255);
const dealerCarPlateText = 'DEALER';

// Textlabel Setup
const textLabelDistance = 3.5;

// InteractionController Setup
const interactionRange = 0.8;
const interactionDescription = "Buy Vehicle";

// Blip Setup
const blipSprite = 663;
const blipColor = 2;
const blipPositions = [
    { "x": -50.05485534667969, "y": -1110.887451171875, "z": 26.4357967376709 }, // Index 0
    { "x": -579.6703491210938, "y": 323.5991516113281, "z": 84.7758560180664 } // Index 1 and so on.....
];

const blipNames = [
    "VehicleDealer-1", // Blip for Index 0 of Blip Positions
    "Lords-Vehicledealership" // Blip for Index 1 of Blip Positions and so on.
];
// Keep Orders Pos, Rot, VehicleModel for example:
// Dont mix them
/* 
    vehiclePositons:
    { SultanRS Pos }

    vehicleRotations: 
    { SultanRS Rot }

    vehiclesToSell:
    "sultanRS"

*/
const vehiclePositions = [
    // Dealer 1 Positions ...
    { x: -61.8989, y: -1117.5297, z: 25.7920 }, // SultanRS Position
    { x: -59.0901, y: -1117.3319, z: 25.7245 }, // Emerus Position
    { x: -56.2934, y: -1117.4456, z: 26.0101 }, // Zentorno Position
    { x: -53.5368, y: -1117.5863, z: 26.0094 }, // T20 Position
    { x: -50.6375, y: -1117.5499, z: 25.9621 }, // Reaper Position
    { x: -47.7709, y: -1116.7627, z: 25.6915 }, // Tyrant Position
    { x: -44.9958, y: -1116.9357, z: 25.9978 }, // Comet2 Position
    { x: -42.3344, y: -1116.9359, z: 25.6663 }, // Jester Position

    // Dealer 2 Positions ...
    { x: -587.3350, y: 315.3230, z: 84.6508 },

    // Dealer 3 Positions ...
    // < - >

    // And so on.
];

const vehicleRotations = [
    { x: 0.0007, y: 0.0007, z: 0.0449 }, // SultanRS Rotation
    { x: 0.0007, y: 0.0007, z: 0.0269 }, // Emerus Rotation
    { x: 0.0001, y: -0.0006, z: 0.0315 }, // Zentorno Rotation
    { x: -0.0007, y: 0.0065, z: 0.0470 }, // T20 Rotation
    { x: 0.0098, y: 0.0000, z: 0.0540 }, // Reaper Rotation
    { x: -0.0013, y: 0.0002, z: 0.0621 }, // Tyrant Rotation
    { x: -0.0011, y: 0.0000, z: 0.0509 }, // Comet2 Rotation
    { x: 0.0026, y: -0.0004, z: 0.0152 }, // Jester Rotation

    // Dealer 2 Rotations ...
    { x: -0.0038, y: 0.0356, z: -0.1070 },

    // Dealer 3 Rotations ...
    // < - >

    // And so on.
];

const vehiclesToSell = [
    // Dealer 1 Vehicles ...
    "sultanrs",
    "emerus",
    "zentorno",
    "t20",
    "reaper",
    "tyrant",
    "comet2",
    "jester",

    // Dealer 2 Vehicles ...
    "feltzer2",

    // Dealer 3 Vehicles ...
    // < - >

    // And so on.
];

```

## CLIENTSIDE CONFIGURATION
```typescript
const securityText = "I am sure to buy this vehicle!";
const wrongCaptcha = "The captcha you've submitted seems to be wrong. Try again.";
const noCaptcha = "You've no captcha submitted in the input menu!";
```
