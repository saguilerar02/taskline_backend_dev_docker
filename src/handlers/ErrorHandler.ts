
export const responseErrorMaker = 
    function(err: any){
        let form_errors:any = {};
        Object.keys(err.errors).forEach((key) => {
            form_errors[key]=err.errors[key].message;
        });
        return form_errors;
    }

export const responseUserErrorMaker = 
function(err: any){
    switch(err.constructor.name){
        case 'MongoError':{
            let message ="Ha ocurrido un error inesperado, intentelo más tarde";
            if(err.code === 11000 && err.keyPattern.email === 1){
                message='El email especificado ya está en uso';
            }else if(err.code === 11000 && err.keyPattern.username===1){
                message='El nombre de usuario ya está en uso';
            }
            return {status:422,error:{type:'DUPLICATED',error:message}};
        }break;
        case 'ValidationError':{
            let form_errors:any = {};
            Object.keys(err.errors).forEach((key) => {
                form_errors[key]=err.errors[key].message;
            });
            return {status:500,error:{type:'VALIDATION_ERROR',error:form_errors}}
        }break;
        default:{
            return {status:500,error:{type:'ERROR',error: 'Ha habido un error inesperado, por favor intentelo de nuevo más tarde'}}
        }break;
    }
}