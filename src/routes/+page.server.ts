export const load = async ({ fetch }) => {
	const res = await fetch('https://catfact.ninja/fact?max_length=140');
	const fact = await res.json();
	return {
		fact
	};
};
