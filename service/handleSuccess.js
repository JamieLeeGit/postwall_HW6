const handleSuccess = (res, httpStatus, data)=>{
        console.log(data);
        console.log(res);
        res.status(httpStatus)
            .send(data);
        res.end();
    }


module.exports = handleSuccess;