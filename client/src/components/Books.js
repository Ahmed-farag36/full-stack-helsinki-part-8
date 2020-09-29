import React from "react";
import { gql, useQuery } from "@apollo/client";

const Books = (props) => {
	const { loading, data } = useQuery(ALL_BOOKS);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!props.show) {
		return null;
	}

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{data.allBooks.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const ALL_BOOKS = gql`
	query {
		allBooks {
			title
			author
			published
		}
	}
`;

export default Books;
