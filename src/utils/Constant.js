class Constant {

    getHeader() {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.getToken(),
            },
        };
    }

    getToken() {
        return localStorage.getItem("authToken")
    }

}

export default new Constant();