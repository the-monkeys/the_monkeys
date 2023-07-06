class Constant {

    getHeader() {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.getToken(),
            },
        };
    }

    // setToken(payload) {
    //     localStorage.setItem("authToken", payload)
    // }

    getToken() {
        return atob(localStorage.getItem("authToken"))
    }

}

export default new Constant();