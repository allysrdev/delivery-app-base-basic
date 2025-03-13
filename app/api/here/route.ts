import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  try {
    const response = await fetch(
      `https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?` +
        new URLSearchParams({
          apiKey: '5fnVQZ-fkGQZDLQOIs-N7OWd7tYpjcOPywXzYglhlcI', // Use a chave da API do lado do servidor
          query: query as string,
          resultType: 'areas',
          maxresults: '5',
        })
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('HERE API Error:', error);
    res.status(500).json({ error: 'Failed to fetch address suggestions' });
  }
}