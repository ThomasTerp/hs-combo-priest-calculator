const CardType = Object.freeze({
	Spell: 1,
	Minion: 2,
	HeroPower: 3
});

class Card
{
	constructor(name, cardType, cost, damage, isInHand)
	{
		this.name = name;
		this.cardType = cardType;
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
		const penFlinger = new Card("Pen Flinger", CardType.Minion, 1, 1, $("#penFlingerCheckbox").prop("checked"));
		const spawnOfShadows = new Card("Spawn of Shadows", CardType.Minion, 4, 0, $("#spawnOfShadows").prop("checked"));
		const razaTheChained = new Card("Raza the Chained", CardType.Minion, 5, 0, $("#razaTheChainedCheckbox").prop("checked"));
		const heroPower = new Card("hero power", CardType.HeroPower, razaTheChained.isInHand ? 0 : 2, 2, true)
		const cards = [];
		let mana = parseInt($("#manaNumber").val())

		const addCostCards = (cardType, cost, amount) =>
		{
			for(let i = 0; i < amount; i++)
			{
				cards.push(new Card(`${cost}-cost ${cardType === CardType.Spell ? "spell" : "minion"}`, cardType, cost, 0, true))
			}
		};

		addCostCards(CardType.Spell, 0, parseInt($("#cost0SpellsNumber").val()))
		addCostCards(CardType.Spell, 1, parseInt($("#cost1SpellsNumber").val()))
		addCostCards(CardType.Spell, 2, parseInt($("#cost2SpellsNumber").val()))
		addCostCards(CardType.Spell, 3, parseInt($("#cost3SpellsNumber").val()))
		addCostCards(CardType.Spell, 4, parseInt($("#cost4SpellsNumber").val()))
		addCostCards(CardType.Spell, 5, parseInt($("#cost5SpellsNumber").val()))

		const lastSpell = cards[cards.length - 1];

		addCostCards(CardType.Minion, 0, parseInt($("#cost0MinionsNumber").val()))
		addCostCards(CardType.Minion, 1, parseInt($("#cost1MinionsNumber").val()))
		addCostCards(CardType.Minion, 2, parseInt($("#cost2MinionsNumber").val()))
		addCostCards(CardType.Minion, 3, parseInt($("#cost3MinionsNumber").val()))
		addCostCards(CardType.Minion, 4, parseInt($("#cost4MinionsNumber").val()))
		addCostCards(CardType.Minion, 5, parseInt($("#cost5MinionsNumber").val()))

		let damageToOpponent = 0;
		let damageToSelf = 0;
		let actionCount = 0;

		const logResult = (text) =>
		{
			$(`#resultSpan`).append(text);
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

		const useHeroPower = () =>
		{
			if(mana >= heroPower.cost)
			{
				mana -= heroPower.cost;
				damageToOpponent += heroPower.damage;

				if(spawnOfShadows.isInHand)
				{
					damageToOpponent += 4;
					damageToSelf += 4;
				}

				logResult(`${++actionCount}: Use ${heroPower.name}<br />`);

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

		if(spawnOfShadows.isInHand)
		{
			playCard(spawnOfShadows);
			useHeroPower();
		}
		else if(heroPower.cost === 0)
		{
			useHeroPower()
		}

		for(const card of cards)
		{
			if(card.cardType === CardType.Spell && penFlinger.isInHand)
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

			if(playCard(card) && !isOpponentDead())
			{
				useHeroPower()
			}

			if(isOpponentDead())
			{
				break;
			}

			if(card === lastSpell && penFlinger.isInHand)
			{
				if(playCard(penFlinger) && !isOpponentDead())
				{
					useHeroPower()
				}
			}
		}

		logResult(`Damage to opponent: ${damageToOpponent}<br />Damage to self: ${damageToSelf}<br />Mana left: ${mana}<br />`);
	});
});
