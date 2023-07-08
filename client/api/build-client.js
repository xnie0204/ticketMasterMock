import axios from 'axios'

export default ({req}) => {
    if (typeof window === 'undefined'){
        // on prod server
         return axios.create({
            baseURL:'http://www.mock-ticketmaskter.lat/',
            headers: req.headers
        })
        
        //on dev server
        // return axios.create({
        //     baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        //     headers: req.headers
        // })
    }else {
        //on broswer
        return axios.create({
            baseURL:'/'
        })
    }
}