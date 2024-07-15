import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

function DramaList() {
  const [dramas, setDramas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDramas = async () => {
      try {
        const response = await axios.get('https://mydramalist.p.rapidapi.com/recommendations', {
          params: { category: 'recent' },
          headers: {
            'x-rapidapi-host': 'mydramalist.p.rapidapi.com',
            'x-rapidapi-key': 'ceb8fe59c9msh8fb2b0eeadb7f87p19c80fjsn25f65b457832',
          }
        });
        setDramas(response.data.results);
      } catch (error) {
        console.error("There was an error fetching the dramas!", error);
        setError(error);
      }
    };

    fetchDramas();
  }, []);

  if (error) return <div>Error fetching dramas: {error.message}</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        {dramas.map(drama => (
          <div className="col-md-4 mb-4" key={drama.id}>
            <Card>
              <Card.Img variant="top" src={drama.image_url} alt={drama.title} />
              <Card.Body>
                <Card.Title>{drama.title}</Card.Title>
                <Card.Text>Category: {drama.category}</Card.Text>
                {/* Add more details as needed */}
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DramaList;
