import * as alt from 'alt-client';
import * as native from 'natives';
import { InputView } from '../../client/views/input';
import { VEHICLE_STATE } from '../../shared/enums/vehicle';
import { View_Events_Dealership } from '../../shared/enums/views';
import { InputOptionType, InputResult } from '../../shared/interfaces/InputMenus';

const securityText = "I am sure to buy this vehicle!";
const wrongCaptcha = "The captcha you've submitted seems to be wrong. Try again.";
const noCaptcha = "You've no captcha submitted in the input menu!";

alt.on('gameEntityCreate', (vehicle: alt.Vehicle) => {
    if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.OWNER) == "dealership") {
        native.freezeEntityPosition(vehicle.scriptID, true);
        native.setEntityCanBeDamaged(vehicle.scriptID, false);
    }
});

alt.onServer("VehicleDealer:OpenInputMenu", (vehicleData: any) => {
    const InputMenu = {
        title: "Vehicledealer",
        options: [
            {
                id: 'VehicleDealer',
                desc: `You are about to buy ${vehicleData.display} for ${addCommas(vehicleData.price)}$ - Type '${securityText}' to buy this vehicle.`,
                placeholder: "<Text>",
                type: InputOptionType.TEXT,
                error: "Error!"
            }
        ],
        callback: (results: InputResult[]) => {
            if (results.length <= 0) {
                InputView.show(InputMenu);
                return;
            }

            const data = results.find((x) => x && x.id === 'VehicleDealer');
            if (!data || !data.value) {
                alt.emitServer("VehicleDealer:Error", noCaptcha);
                InputView.show(InputMenu);
                return;
            }
            alt.emit("VehicleDealer:VerifyPurchase", data.value, vehicleData.name);
        }
    }
    InputView.show(InputMenu);
});

alt.on("VehicleDealer:VerifyPurchase", (captcha: string, vehicleName: string) => {
    if (!captcha) return;
    if (captcha == securityText) {
        alt.emitServer(View_Events_Dealership.Purchase, vehicleName);
    } else {
        alt.emitServer("VehicleDealer:Error", wrongCaptcha);
    }
});

alt.onServer("VehicleDealer:GetVehPos", (player: alt.Player) => {
    console.log(alt.Player.local.vehicle.pos);
    console.log(alt.Player.local.vehicle.rot);
});

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