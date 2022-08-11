const mongoose = require("mongoose");

const DeleteParentChildsService= async (Request, ParentModel,ChildsModel,JoinPropertyName) => {

    const session = await mongoose.startSession();
    try{

        // Begin Transaction
        await session.startTransaction();


        // Parent Creation
        let DeleteID=Request.params.id;
        let UserEmail=Request.headers['email'];

        let ChildQueryObject={};
        ChildQueryObject[JoinPropertyName]=DeleteID;
        ChildQueryObject[UserEmail]=UserEmail;

        let ParentQueryObject={};
        ParentQueryObject['_id']=DeleteID;
        ParentQueryObject[UserEmail]=UserEmail;


        let ChildsDelete=  await ChildsModel.remove(ChildQueryObject).session(session);
        let ParentDelete= await ParentModel.remove(ParentQueryObject).session(session)


        // Commit Transaction
        await session.commitTransaction();
        session.endSession();

        
        return {status: "success",Parent:ParentDelete,Childs:ChildsDelete}

    }
    catch (error) {
        // Roll Back Transaction
        await session.abortTransaction();
        session.endSession();
        return {status: "fail", data: error.toString()}
    }
}
module.exports=DeleteParentChildsService