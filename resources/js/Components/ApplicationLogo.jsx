import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ApplicationLogo(props) {
    const [set_logo, setLogo] = useState('/cms/img/j.png');

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get('/api/settings');
                if (response.data.set_logo) {
                    setLogo(response.data.set_logo);
                }
            } catch (error) {
                console.error('Error fetching set_logo', error);
            }
        };

        fetchLogo();
    }, []);

    return (
        <img
            {...props}
            src={set_logo}
            alt="Logo"
            className="h-12 w-auto lg:h-16"
        />
    );
}