function SeeDatabaseButton() {
  const handleSeed = () => {
    alert("Database seeded! (placeholder)");
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Seed Database</h1>
      <button
        onClick={handleSeed}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Seed Database
      </button>
    </div>
  );
}

export default SeeDatabaseButton;
