import { ClientSession, Model } from "mongoose"

export const startTransaction =async function(model:Model<any>) {
    
    let session = await model.db.startSession();
    await session.startTransaction();
    console.log("Transaction started...");
    
    return session;
}

export const abortTransaction = async function (session:ClientSession|null) {
    
    if(session){
        await session.abortTransaction();
        console.log("Transaccion abortada");
        session.endSession();
    }
}

export const commitTransaction = async function (session:ClientSession|null) {
    
    if(session){
        await  session.commitTransaction();
        session.endSession();
        console.log("La transacción se ha realizado con éxito");
    }
}