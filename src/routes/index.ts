import {Express} from "express";
import {addressRouter} from "./address.route";
import {authRouter} from "./auth.route";
import {donRouter} from "./don.route";
import {donProductRouter} from "./donProduct.route";
import {entrepotRouter} from "./entrepot.route";
import {mediaRouter} from "./media.route";
import {mediaProductRouter} from "./mediaProduct.route";
import {mediaTypeRouter} from "./mediaType.route";
import {orderedRouter} from "./ordered.route";
import {orderedProductRouter} from "./orderedProduct.route";
import {productRouter} from "./product.route";
import {sendRouter} from "./send.route";
import {userAddressRouter} from "./userAddress.route";

export function buildRoutes(app: Express) {
    app.use("/address", addressRouter);
    app.use("/auth", authRouter);
    app.use("/don", donRouter);
    app.use("/donProduct", donProductRouter);
    app.use("/entrepot", entrepotRouter);
    app.use("/media", mediaRouter);
    app.use("/mediaProduct", mediaProductRouter);
    app.use("/mediaType", mediaTypeRouter);
    app.use("/ordered", orderedRouter);
    app.use("/orderedProduct", orderedProductRouter);
    app.use("/product", productRouter);
    app.use("/send", sendRouter);
    app.use("/userAddress", userAddressRouter);
}
