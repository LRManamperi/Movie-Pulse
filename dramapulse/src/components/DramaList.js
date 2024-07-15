import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function DramaList() {
  const [dramas, setDramas] = useState([]);
  const [error, setError] = useState(null);

  const fetchDramas = async () => {
    try {
      const response = await axios.get('https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup', {
        params: {
          term: 'bojack',
          country: 'uk'
        },
        headers: {
          'x-rapidapi-host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
          'x-rapidapi-key': process.env.REACT_APP_UTELLY_API_KEY
        }
      });
      setDramas(response.data.results);
    } catch (error) {
      console.error("There was an error fetching the dramas!", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchDramas();
  }, []);

  if (error) return <div>Error fetching dramas: {error.message}</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        {dramas.map(drama => (
          <div className="col-md-4 mb-4" key={drama.id}>
            <Card>
              <Card.Img variant="top" src={drama.picture} />
              <Card.Body>
                <Card.Title>{drama.name}</Card.Title>
                <Card.Text>{drama.locations.map(location => location.display_name).join(', ')}</Card.Text>
                <Button as={Link} to={`/drama/${drama.id}`} variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DramaList;
