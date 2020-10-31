
export const responseErrorMaker = 
    function(err: any){
        let form_errors:any = {};
        Object.keys(err.errors).forEach((key) => {
            form_errors[key]=err.errors[key].message;
        });
        console.error(Object.values(form_errors));

        return form_errors;
    }

export const responseUserErrorMaker = 
function(err: any){
    switch(err.constructor.name){
        case 'MongoError':{
            let message ="Something went wrong";
            if(err.code === 11000 && err.keyPattern.email === 1){
                message='Email duplicated';
            }else if(err.code === 11000 && err.keyPattern.username===1){
                message='Username duplicated';
            }
            return {status:422,data:message};
        }break;
        case 'ValidationError':{
            let form_errors:any = {};
            Object.keys(err.errors).forEach((key) => {
                form_errors[key]=err.errors[key].message;
            });
            return {status:500,data:form_errors}
        }break;
        default:{
            return {status:500,data: 'Something went wrong, retry again'}
        }break;
    }
}