// <------ IMPORTS Beginning ------>
import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from "../../shared/enums/system";
import { TextLabelController } from "../../server/systems/textlabel";
import { VehicleData } from "../../shared/information/vehicles";
import ChatController from "../../server/systems/chat";
import { PERMISSIONS } from "../../shared/flags/PermissionFlags";
import { IVehicle } from "../../shared/interfaces/IVehicle";
import { Vehicle_Behavior, VEHICLE_LOCK_STATE, VEHICLE_STATE } from "../../shared/enums/vehicle";
import { InteractionController } from "../../server/systems/interaction";
import { BlipController } from "../../server/systems/blip";
import { playerFuncs } from "../../server/extensions/Player";
// <------ IMPORTS Ending ------>

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

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, loadVehicleDealers)

function loadVehicleDealers(vehicle: IVehicle, model: string) {
    blipPositions.forEach((blip, index) => {
        BlipController.add({
            sprite: blipSprite,
            color: blipColor,
            shortRange: true,
            uid: `Vehicledealerblip-${index}`,
            pos: blipPositions[index] as alt.Vector3,
            text: blipNames[index],
            scale: 1
        });
    });
    vehiclePositions.forEach((vehicleSpot, index) => {
        const vehicleData = VehicleData.find((x) => x.name === vehiclesToSell[index]);
        const dealerCar = new alt.Vehicle(vehicleData.name, vehiclePositions[index].x, vehiclePositions[index].y, vehiclePositions[index].z, vehicleRotations[index].x, vehicleRotations[index].y, vehicleRotations[index].z);

        dealerCar.behavior = Vehicle_Behavior.NO_SAVE;
        dealerCar.lockState = VEHICLE_LOCK_STATE.LOCKED;
        dealerCar.numberPlateText = dealerCarPlateText;
        dealerCar.customPrimaryColor = dealerCarPrimaryColor;
        dealerCar.customSecondaryColor = dealerCarSecondaryColor;
        dealerCar.setStreamSyncedMeta(VEHICLE_STATE.OWNER, `dealership`);

        TextLabelController.append({
            uid: "test",
            pos: vehiclePositions[index] as alt.Vector3,
            data: `Model: ~g~${vehicleData.display}~n~~w~Price: ~g~${addCommas(vehicleData.price.toString())}$~n~~w~Trunk: ~g~${vehicleData.storage} ~w~Slots~n~~w~Seats: ~g~${vehicleData.seats}`,
            maxDistance: textLabelDistance
        });

        InteractionController.add({
            identifier: `Dealership-${index}`,
            position: { x: vehiclePositions[index].x, y: vehiclePositions[index].y + 3, z: vehiclePositions[index].z - 1 },
            type: 'Dealer',
            description: interactionDescription,
            range: interactionRange,
            callback: (player: alt.Player) => {
                alt.emitClient(player, "VehicleDealer:OpenInputMenu", vehicleData);
            }
        })
    });
}

alt.onClient("VehicleDealer:Error", (player: alt.Player, errorMsg: string) => {
    playerFuncs.emit.notification(player, errorMsg);
});

ChatController.addCommand('vehpos', 'returns the current position of your vehicle', PERMISSIONS.ADMIN, returnPos);
function returnPos(player: alt.Player) {
    if (player.vehicle) {
        alt.emitClient(player, "VehicleDealer:GetVehPos");
    }
}

function addCommas(nStr: string) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}

// German String Translation for Textlabel
// data: `Model: ~g~${vehicleData.display}~n~~w~Preis: ~g~${addCommas(vehicleData.price.toString())}$~n~~w~Kofferraum: ~g~${vehicleData.storage}~n~~w~Sitze: ~g~${vehicleData.seats}`,