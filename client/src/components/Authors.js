import React from "react";
import { gql, useQuery } from "@apollo/client";

const Authors = (props) => {
	const { loading, data } = useQuery(ALL_AUTHORS);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!props.show) {
		return null;
	}

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{data.allAuthors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			born
			bookCount
		}
	}
`;

export default Authors;
