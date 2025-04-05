import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const initialFacts = [
  {
    id: 1,
    name_of_trip: "Wakacje w Hiszpanii",
    source: "https://www.onet.pl",
    planned_cost: 2000,
    actual_cost: 3000,
    payment_date: "2025-03-25",
    paid_by: "Joanna",
    payer: "Tomasz",
    category: "Zakupy",
    refund_done: true,
    suspended: false,
    is_paid: false,
    cost_name: "Bilety",
    source: "onet.pl",
  },
  {
    id: 2,
    name_of_trip: "Wakacje w Hiszpanii",
    source: "https://www.onet.pl",
    planned_cost: 2000,
    actual_cost: 3000,
    payment_date: "2025-03-25",
    paid_by: "Joanna",
    payer: "Tomasz",
    category: "Transport",
    refund_done: true,
    suspended: false,
    is_paid: false,
    cost_name: "Bilety hotelowe",
    source: "onet.pl",
  },
];

function formatDateToYMD(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function Counter() {
  const [count, setCount] = useState(0);

  // bnt.addEventListener('click', function()...)
  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  // 1, define state var
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("All");
  //filtuj
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  //koniec filtr

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "All")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("name_of_trip", { ascending: true })
          .limit(100);

        console.log(error);
        console.log(facts);
        if (!error) setFacts(facts);
        else alert(" There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );
  //filtr
  useEffect(() => {
    async function getTrips() {
      const { data, error } = await supabase
        .from("facts")
        .select("name_of_trip")
        .order("name_of_trip", { ascending: true });

      if (!error && data) {
        const uniqueTrips = [...new Set(data.map((d) => d.name_of_trip))];
        setTrips(uniqueTrips);
      }
    }

    getTrips();
  }, []);

  return (
    <>
      <Header
        showForm={showForm}
        setShowForm={setShowForm}
        setIsFilterOpen={setIsFilterOpen}
      />

      {/* 2. use state varible*/}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        <section>
          {isFilterOpen && (
            <div className="filter-dropdown">
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
              >
                <option value="">-- Wybierz wyjazd --</option>
                {trips.map((trip) => (
                  <option key={trip} value={trip}>
                    {trip}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-small"
                onClick={() => {
                  if (selectedTrip) {
                    setCurrentCategory("All");
                    setFacts((prev) =>
                      prev.filter((fact) => fact.name_of_trip === selectedTrip)
                    );
                  }
                  setIsFilterOpen(false);
                }}
              >
                OK
              </button>
              <button
                className="btn btn-small"
                onClick={() => setIsFilterOpen(false)}
              >
                Anuluj
              </button>
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            <FactList
              facts={facts}
              setFacts={setFacts}
              currentCategory={currentCategory}
            />
          )}
        </section>
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm, setIsFilterOpen }) {
  const appTitle = " Welcome to the travel planner!";
  return (
    <header
      className="header"
      showForm={showForm}
      setShowForm={setShowForm}
      setIsFilterOpen={setIsFilterOpen}
    >
      <div className="logo">
        <img
          src="logo4.png"
          style={{ backgroundColor: "#292524" }}
          height="100"
          width="100"
          alt="Travel Planer"
        />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Zamknij" : " ➕ Dodaj Koszt"}
      </button>
      <button
        className="btn btn-large btn-filter"
        onClick={() => setIsFilterOpen((f) => !f)}
      >
        🔍 Filtruj
      </button>
    </header>
  );
}
const CATEGORIES = [
  { name: "Transport", color: "#3b82f6" },
  { name: "Nocleg", color: "#16a34a" },
  { name: "Wejściówki", color: "#ef4444" },
  { name: "Zakupy", color: "#eab308" },
  { name: "Kantor", color: "#db2777" },
  { name: "Jedzenie", color: "#14b8a6" },
  { name: "Napiwki", color: "#f97316" },
  { name: "Inne", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [name_of_trip, setName_of_trip] = useState("");
  const [cost_name, setCost_name] = useState("");
  const [planned_cost, setPlanned_cost] = useState("");
  const [actual_cost, setActual_cost] = useState("");
  const [refund_done, setRefund_done] = useState("");
  const [payment_date, setPayment_date] = useState(formatDateToYMD(new Date()));
  const [paid_by, setPaid_by] = useState("");
  const [payer, setPayer] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [IsUploading, setIsUploading] = useState(false);
  const textLength = name_of_trip.length;
  const textLength2 = cost_name.length;
  const textLength3 = paid_by.length;
  const textLength4 = payer.length;
  const textLength5 = source.length;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(
      name_of_trip,
      cost_name,
      planned_cost,
      refund_done,
      payment_date,
      paid_by,
      payer,
      category,
      source
    );
    if (
      name_of_trip &&
      cost_name &&
      planned_cost &&
      category &&
      isValidHttpUrl(source) &&
      textLength <= 200 &&
      textLength2 <= 200 &&
      textLength3 <= 200 &&
      textLength4 <= 200 &&
      textLength5 <= 400
    ) {
      //create
      // const newFact = {
      //  id: Math.round(Math.random() * 10000000),
      //  name_of_trip,
      //  cost_name,
      //  planned_cost,
      //  refund_done,
      //  payment_date: new Date().toISOString().slice(0, 10),
      //  paid_by,
      //  payer,
      //  category,
      // source,
      // refund_done: true,
      // suspended: false,
      //  is_paid: false,
      //};
      // upload fact
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert({
          name_of_trip,
          cost_name,
          planned_cost: Number(planned_cost),
          actual_cost: Number(actual_cost),
          refund_done: Boolean(refund_done),
          payment_date,
          paid_by,
          payer,
          category,
          source,
          suspended: false,
          is_paid: false,
          votesInteresting: 0,
        })
        .select();
      setIsUploading(false);

      if (error) {
        console.error("❌ Insert error:", error.message);
        alert("Błąd podczas dodawania kosztu. Sprawdź dane.");
        return;
      }

      if (newFact && newFact.length > 0) {
        setFacts((facts) => [newFact[0], ...facts]);
      }

      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      setName_of_trip("");
      setCost_name("");
      setPlanned_cost("");
      setActual_cost("");
      setRefund_done("");
      setPayment_date("");
      setPaid_by("");
      setPayer("");
      setCategory("");
      setSource("");

      setShowForm(false);
    }
    console.log("There is valid data");
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        value={name_of_trip}
        type="text"
        placeholder="Podaj nazwę wyjazdu"
        onChange={(e) => setName_of_trip(e.target.value)}
        disabled={IsUploading}
      />
      <span>{200 - textLength}</span>

      <input
        value={cost_name}
        type="text"
        placeholder="Podaj nazwę kosztu"
        onChange={(e) => setCost_name(e.target.value)}
        disabled={IsUploading}
      />
      <span>{200 - textLength2}</span>

      <input
        value={planned_cost}
        type="number"
        placeholder="Podaj planowy koszt"
        onChange={(e) => setPlanned_cost(e.target.value)}
        disabled={IsUploading}
      />
      <input
        value={actual_cost}
        type="number"
        placeholder="Podaj kwotę rzeczywistą"
        onChange={(e) => setActual_cost(e.target.value)}
        disabled={IsUploading}
      />

      <input
        value={payment_date}
        type="date"
        placeholder="Podaj datę opłaty"
        onChange={(e) => setPayment_date(e.target.value)}
        disabled={IsUploading}
      />
      <input
        value={paid_by}
        type="text"
        placeholder="Kto opłacił"
        onChange={(e) => setPaid_by(e.target.value)}
        disabled={IsUploading}
      />
      <span>{200 - textLength3}</span>
      <input
        value={payer}
        type="text"
        placeholder="Kto zwraca pieniądze"
        onChange={(e) => setPayer(e.target.value)}
        disabled={IsUploading}
      />
      <span>{200 - textLength4}</span>
      <input type="checkbox" placeholder="Zwrot dokonany" />
      <span>Oznacz jeśli nieopłacone</span>
      <label>
        <input
          //value={refund_done}
          type="checkbox"
          checked={refund_done}
          placeholder="Czy rozliczone?"
          onChange={(e) => setRefund_done(e.target.checked)}
          disabled={IsUploading}
        />
      </label>
      <span>Oznacz jeśli rozliczone</span>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Wybierz kategorię:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <input
        value={source}
        type="text"
        placeholder="Link"
        onChange={(e) => setSource(e.target.value)}
        disabled={IsUploading}
      />
      <span>{400 - textLength5}</span>
      <button className="btn btn-large" disabled={IsUploading}>
        Dodaj
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-large btn-all"
            onClick={() => setCurrentCategory("All")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-large btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, currentCategory, setFacts }) {
  //temporary
  if (!facts || facts.length === 0) {
    return (
      <p className="message">
        {currentCategory === "All"
          ? "There are 0 costs in the database. Add your own!"
          : "There are 0 costs in this category. Create the first one!"}
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} cost in the database. Add your own!</p>
    </section>
  );
}
//Fact(fact);

function Fact({ fact, setFacts }) {
  const [isUpdatimg, setIsUpdating] = useState(false);
  async function handleVote() {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ votesInteresting: fact.votesInteresting + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);
    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  async function handleUpdate(field, value) {
    const { data, error } = await supabase
      .from("facts")
      .update({ [field]: value })
      .eq("id", fact.id)
      .select();

    if (!error && data && data.length > 0) {
      setFacts((prev) =>
        prev.map((f) =>
          f.id === fact.id
            ? {
                ...f,
                [field]: value,
              }
            : f
        )
      );
    } else {
      alert("❌ Błąd podczas aktualizacji");
    }
  }
  return (
    <li className="fact" data-trip-name="Wakacje w Hiszpanii">
      <p>{fact.name_of_trip}</p>
      <div className="fact-table">
        <table>
          <tbody>
            <tr>
              <td>Nazwa wyjazdu:</td>
              <td>{fact.name_of_trip}</td>
            </tr>
            <tr>
              <td>Nazwa kosztu:</td>
              <td>{fact.cost_name}</td>
            </tr>
            <tr>
              <td>Planowany koszt:</td>
              <td>{fact.planned_cost} zł</td>
            </tr>
            <tr>
              <td>Kwota rzeczywista:</td>
              <td>{fact.actual_cost} zł</td>
            </tr>
            <tr>
              <td>Data opłaty:</td>
              <td>{fact.payment_date}</td>
            </tr>
            <tr>
              <td>Kto opłacił:</td>
              <td>{fact.paid_by}</td>
            </tr>
            <tr>
              <td>Kto zwraca:</td>
              <td>{fact.payer}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="fact-footer">
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>

        <span
          className="tag"
          style={{
            backgroundColor: CATEGORIES.find(
              (cat) => cat.name === fact.category
            ).color,
          }}
        >
          {fact.category}
        </span>
      </div>
      <div className="money">
        <button
          className={fact.is_paid ? "paid" : "unpaid"}
          onClick={() => handleUpdate("is_paid", !fact.is_paid)}
        >
          💵 {fact.is_paid ? "Opłacone" : "Nieopłacone"}
        </button>
        <button
          className={fact.suspended ? "suspended" : "not-suspended"}
          onClick={() => handleUpdate("suspended", !fact.suspended)}
        >
          ⏸️ {fact.suspended ? "Wstrzymane" : "Aktywne"}
        </button>
        <button
          className={fact.refund_done ? "refunded" : "not-refunded"}
          onClick={() => handleUpdate("refund_done", !fact.refund_done)}
        >
          🔒 {fact.refund_done ? "Rozliczone" : "Nierozliczone"}
        </button>
        <button onClick={handleVote} disabled={isUpdatimg} className="vote-btn">
          👌 {fact.votesInteresting ?? 0}
        </button>
      </div>
    </li>
  );
}
export default App;
