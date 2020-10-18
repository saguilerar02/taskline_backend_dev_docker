
export const responseErrorMaker = 
    function(err: any){
        let form_errors:any = {};
        Object.keys(err.errors).forEach((key) => {
            form_errors[key]=err.errors[key].message;
        });
        console.error(Object.values(form_errors));

        return form_errors;
    }