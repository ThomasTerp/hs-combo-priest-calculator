class Card
{
	constructor(name, cost, damage, isInHand)
	{
		this.name = name;
		this.cost = cost;
		this.damage = damage;
		this.isInHand = isInHand;
	}
}

$(document).ready(() =>
{
	$(document).on("mousewheel", `input[type="number"]`, (event) =>
	{
		const inputHTML = $(event.target);
		inputHTML.val(parseInt(inputHTML.val()) + (event.deltaY > 0 ? 1 : -1))
	});

	$(`#calculateButton`).on("click", () =>
	{
		$(`#resultSpan`).empty();

		const opponentHealth = parseInt($("#opponentHealthNumber").val()) +parseInt($("#opponentArmorNumber").val());
		const penFlinger = new Card("Pen Flinger", 1, 1, $("#penFlingerCheckbox").prop("checked"));
		const spawnOfShadows = new Card("Spawn of Shadows", 4, 4, $("#spawnOfShadows").prop("checked"));
		const razaTheChained = new Card("Raza the Chained", 5, 0, $("#razaTheChainedCheckbox").prop("checked"));
		const heroPower = new Card("hero power", razaTheChained.isInHand ? 0 : 2, 2, true)
		const cards = [];
		let mana = parseInt($("#manaNumber").val())

		const addCostCards = (cost, amount) =>
		{
			for(let i = 0; i < amount; i++)
			{
				cards.push(new Card(cost + "-cost card", cost, 0, true))
			}
		};

		addCostCards(0, parseInt($("#cost0CardsNumber").val()))
		addCostCards(1, parseInt($("#cost1CardsNumber").val()))
		addCostCards(2, parseInt($("#cost2CardsNumber").val()))
		addCostCards(3, parseInt($("#cost3CardsNumber").val()))
		addCostCards(4, parseInt($("#cost4CardsNumber").val()))
		addCostCards(5, parseInt($("#cost5CardsNumber").val()))
		addCostCards(6, parseInt($("#cost6CardsNumber").val()))
		addCostCards(7, parseInt($("#cost7CardsNumber").val()))
		addCostCards(8, parseInt($("#cost8CardsNumber").val()))
		addCostCards(9, parseInt($("#cost9CardsNumber").val()))
		addCostCards(10, parseInt($("#cost10CardsNumber").val()))

		let damageToOpponent = 0;
		let damageToSelf = 0;
		let actionCount = 0;

		const logResult = (text, prependLog) =>
		{
			if(prependLog)
			{
				$(`#resultSpan`).prepend(text);
			}
			else
			{
				$(`#resultSpan`).append(text);
			}
		};

		const playCard = (card) =>
		{
			if(mana >= card.cost)
			{
				mana -= card.cost;
				damageToOpponent += card.damage;

				logResult(`${++actionCount}: Play ${card.name}<br />`);

				return true;
			}
			else
			{
				return false;
			}
		};

		const useHeroPower = (prependLog) =>
		{
			if(mana >= heroPower.cost)
			{
				mana -= heroPower.cost;
				damageToOpponent += heroPower.damage;

				if(spawnOfShadows.isInHand)
				{
					damageToOpponent += spawnOfShadows.damage;
					damageToSelf += spawnOfShadows.damage;
				}

				logResult(`${++actionCount}: Use ${heroPower.name}<br />`, prependLog);

				return true;
			}
			else
			{
				return false;
			}
		};

		const isOpponentDead = () =>
		{
			return damageToOpponent >= opponentHealth;
		};

		if(heroPower.cost === 0)
		{
			useHeroPower()
		}

		if(penFlinger.isInHand)
		{
			if(playCard(penFlinger))
			{
				useHeroPower()
			}
		}

		for(const card of cards)
		{
			if(penFlinger.isInHand)
			{
				if(playCard(penFlinger) && !isOpponentDead())
				{
					useHeroPower()
				}
			}

			if(isOpponentDead())
			{
				break;
			}
			else
			{
				if(playCard(card) && !isOpponentDead())
				{
					useHeroPower()
				}
			}
		}

		if(mana > heroPower.cost)
		{
			useHeroPower(true);
		}

		logResult(`Damage to opponent: ${damageToOpponent}<br />Damage to self: ${damageToSelf}<br />`);
	});
});
