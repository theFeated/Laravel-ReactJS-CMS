import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ApplicationLogo(props) {
    const [logo, setLogo] = useState('/cms/img/j.png');

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get('/api/settings');
                if (response.data.logo) {
                    setLogo(response.data.logo);
                }
            } catch (error) {
                console.error('Error fetching logo', error);
            }
        };

        fetchLogo();
    }, []);

    return (
        <img
            {...props}
            src={logo}
            alt="Logo"
            className="h-12 w-auto lg:h-16"
        />
    );
}