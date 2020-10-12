import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const Authors = (props) => {
	const { loading, data } = useQuery(ALL_AUTHORS);
	const [author, setAuthor] = useState("");
	const [birthday, setBirthday] = useState("");
	const [editAuthor] = useMutation(EDIT_AUTHOR);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!props.show) {
		return null;
	}

	const handleBirthdayChange = (e) => {
		e.preventDefault();
		editAuthor({ variables: { name: author, setBornTo: parseInt(birthday) } });
		setAuthor("");
		setBirthday("");
	};

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
			<h3>Set birthyear</h3>
			<form onSubmit={handleBirthdayChange}>
				<input
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
					placeholder="Author name"
				/>
				<input
					type="number"
					value={birthday}
					onChange={(e) => setBirthday(e.target.value)}
					placeholder="Born"
				/>
				<button>Update</button>
			</form>
		</div>
	);
};

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			id
			name
			born
			bookCount
		}
	}
`;

const EDIT_AUTHOR = gql`
	mutation ADD_BOOK($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			id
			name
			born
			bookCount
		}
	}
`;

export default Authors;
