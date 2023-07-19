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
        return atob(localStorage.getItem("authToken"))
    }

}

export default new Constant();