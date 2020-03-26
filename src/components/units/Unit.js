import ElementsUtil from '../utils/ElementsUtil.js'
import { throttle } from '../utils/HelperFunctions.js'

export default class Unit {
    constructor(config, platform, player) {
        this.player = player;
        this.platform = platform;

        this.hp = config.hp;
        this.name = config.name;
        this.baseDMG = config.baseDMG;
        this.image = config.imageURL;
        this.top = config.top;
        this.left = config.left;
        this.initialHP = this.hp; // don't change
        this.initialBaseDMG = this.baseDMG; // don't change
        this.cord = this.top + 'x' + this.left;
        this.spellColor = config.spellColor;

        this.unitType = config.unitType;
        this.unitSpec = config.unitSpec;
        this.unitClass = config.unitClass;

        this.platform.unitsMapPosition[this.name] = this.top + 'x' + this.left;
        this.friendlyPositions = {};

        this.unitsMediator = null; // get info for current state of all friendly units

        this.isFrozen = false;
        this.isPassedTurn = false;
        this.isActive = false;

        this.hp -= 100;

        this._init();
    }

    _init = () => {
        const cords = this.platform.offsetMap[this.left][this.top];

        this.element = ElementsUtil.div({
            class: ['unit', this.name],
            style: {
                top: cords.top + 'px',
                left: cords.left + 'px'
            },
            dataset: {
                name: this.name,
                top: this.top,
                left: this.left,
                player: this.player,
            }
        });


        this.imgEL = ElementsUtil.img({
            src: this.image,
            style: {
                animationDelay: Math.floor(Math.random() * 10) + '00ms'
            }
        });


        this.healthEL = ElementsUtil.div({
            class: 'healthEL',
            style: {
                height: (this.hp * 0.25) + 'px'
            }
        });

        this.takeDamageEL = ElementsUtil.div({
            class: 'takeDamageEL',
        });


        this.detailsEL = ElementsUtil.div({
            class: 'detailsEL',
        });


        this.details = this._getGeneralDetails(this);
        this._setDetailsContentToElement();

        this.element.append(this.imgEL, this.healthEL, this.detailsEL, this.takeDamageEL);

        this.platform.platformEL.appendChild(this.element);
    }

    setUnitState = newState => {
        for (const key in newState) {
            this[key] = newState[key];
        }

        this.updateVisuals();
    }

    updateVisuals(type) {
        if (type === 'initial' && !this.isFrozen) {
            this.element.classList.add('onTurn');
            return;
        }

        if (this.isActive) {
            this.element.classList.add('isActive');
        } else {
            this.element.classList.remove('isActive');
        }

        if (this.isFrozen) {
            this.element.classList.add('isFrozen');
        } else {
            this.element.classList.remove('isFrozen');
        }

        if (this.isPassedTurn) {
            this.element.classList.add('isPassedTurn');
        } else {
            this.element.classList.remove('isPassedTurn');
        }

        if (this.isEnemy) {
            this.element.classList.add('isEnemy');
        } else {
            this.element.classList.remove('isEnemy');
        }

        if (!this.isFrozen && !this.isPassedTurn) {
            this.element.classList.add('onTurn');
        } else {
            this.element.classList.remove('onTurn');
        }
    }

    _takeDamageAnimation(damage) {
        this.takeDamageEL.textContent = damage;
        this.takeDamageEL.classList.add('takeDamageEL_animation');
        setTimeout(() => {
            this.takeDamageEL.textContent = '';
            this.takeDamageEL.classList.remove('takeDamageEL_animation');
        }, 600);
    }

    updateStatBars() {
        this.healthEL.style.height = (this.hp * 0.25) + 'px';
        this.details = this._getGeneralDetails(this);
        this._setDetailsContentToElement();
    }

    _updatePosition(newCords) {
        if (newCords) {
            const newTop = parseInt(newCords.top, 10);
            const newLeft = parseInt(newCords.left, 10);
            const cords = this.platform.offsetMap[newLeft][newTop];

            this.element.style.top = cords.top + 'px';
            this.element.style.left = cords.left + 'px';
            this.element.dataset.top = newTop;
            this.element.dataset.left = newLeft;
            this.top = newTop;
            this.left = newLeft;
            this.cord = this.top + 'x' + this.left;
            this.platform.unitsMapPosition[this.name] = newTop + 'x' + newLeft;
            this.platform.notifyFor
        }

        this._handleEndTurn();
    }

    _handleUnitActionAnimation(target, attackType) {
        switch (attackType) {
            case 'male': {
                this.element.style.transform = `translate3d(${(target.left - this.left) * 80}px, ${(target.top - this.top) * 80}px, 0)`;
                setTimeout(() => {
                    this.element.style.transform = `translate3d(0, 0, 0)`;
                }, 250);
            }
                break;
            case 'spell': {
                const spellParticle = document.createElement('div');
                spellParticle.classList.add('baseSpellParticle');
                spellParticle.style.backgroundColor = this.spellColor;
                this.element.appendChild(spellParticle);
                setTimeout(() => {
                    spellParticle.style.transform = `translate3d(${(target.left - this.left) * 80}px, ${(target.top - this.top) * 80}px, 0)`;
                }, 10);
                setTimeout(() => {
                    spellParticle.remove();
                }, 250);
            }
                break;
            default: { };
        }
    }

    _attack(target, attackType = 'male') {
        this._handleUnitActionAnimation(target, attackType);

        target.hp -= this.baseDMG;

        if (target.hp <= 0) {
            target._die();

            const enemyPlayer = this.platform.playerMediator.enemyPlayer;

            enemyPlayer.handleUnitDeath(target.name);
            this.platform.notifyUnitDeath(target.name);
            if (!enemyPlayer.hasAliveUnits()) {
                // player lost - no more units alive
                setTimeout(() => {
                    this.platform.playerMediator.anounceVictory(this.player);
                }, 1500);
            }
        } else {
            target.element.classList.add('takeDamage');
            setTimeout(() => {
                target.element.classList.remove('takeDamage');
            }, 500);
        }

        this.updateStatBars();
        target.updateStatBars();
    }

    _onClickOnUnit = e => {
        const ActiveUnit = this.unitsMediator.platform.getCurrentActiveUnit();

        if (this.isEnemy) {
            const Attacker = ActiveUnit; // chnage alias
            if (Attacker && this.canBeAttackedBy(Attacker)) {
                this._takeDamageAnimation(Attacker.baseDMG);
                Attacker._attack(this);
                setTimeout(() => {
                    Attacker._handleEndTurn();
                }, 400);
            }
            return;
        }

        if (this.isActive) {
            this._handleEndTurn();
            return;
        }

        if (!this.isFrozen && !this.isPassedTurn) {
            this._handleMovement();
            this.unitsMediator.notifyMediator('activated', this.name);
        }

        if (ActiveUnit && ActiveUnit._handleSpecialUnitInteraction) {
            // can be used fo healing of buffing a frendly unit
            ActiveUnit._handleSpecialUnitInteraction(this);
            ActiveUnit._handleEndTurn();
        }
    }

    canBeAttackedBy = (unit) => {
        const attacableCords = unit.reachableSquaresAttackable.map(sq => ({
            top: sq.dataset.top,
            left: sq.dataset.left,
        }));

        for (const cords of attacableCords) {
            if (this.top == cords.top && this.left == cords.left) {
                return true;
            }
        }

        return false;
    }

    _getGeneralDetails(data) {
        return `
            <p class="stat name">${data.name}</p>
            <p class="stat"><span>HP:</span> ${data.hp}/${data.initialHP}</p> 
            <p class="stat"><span>DMG:</span> ${data.baseDMG}</p> 
        `;
    }

    enchanceGeneralDetails(content) {
        this.details += `<p class="stat">${content}</p>`
    }

    _setDetailsContentToElement() {
        this.detailsEL.innerHTML = this.details;
    }

    _onMouseEnterUnit = (e) => {
        this.setDetailsTooltipTimeout = setTimeout(() => {
            this.element.classList.add('upFront');
            this.detailsEL.classList.add('detailsELVisible');
        }, 700);
    }

    _onMouseLeaveUnit = (e) => {
        if (this.setDetailsTooltipTimeout) {
            clearTimeout(this.setDetailsTooltipTimeout);
        }
        this.element.classList.remove('upFront');
        this.detailsEL.classList.remove('detailsELVisible');
    }

    activateUnitInteraction() {
        this.element.addEventListener('click', throttle(this._onClickOnUnit, 500));
        this.element.addEventListener('mouseenter', this._onMouseEnterUnit);
        this.element.addEventListener('mouseleave', this._onMouseLeaveUnit);
    }

    _getOtherUnits() {
        const clone = Object.assign({}, this.platform.unitsMapPosition);
        delete clone[this.name];
        return clone;
    }

    _getAroundUnitPositions(top, left) {
        const aroundUnitPosition = [
            top + 'x' + (left - 1),
            top + 'x' + (left + 1),
            (top - 1) + 'x' + left,
            (top + 1) + 'x' + left,
            (top - 1) + 'x' + (left - 1),
            (top - 1) + 'x' + (left + 1),
            (top + 1) + 'x' + (left - 1),
            (top + 1) + 'x' + (left + 1),
        ];

        return aroundUnitPosition;
    }

    _getFormatedAroundUnitPositions(top, left) {
        const aroundUnitPosition = this._getAroundUnitPositions(top, left); // all cords around unit
        const otherUnitsPosition = Object.values(this._getOtherUnits()); // all units without current cords

        const allowed = aroundUnitPosition.filter(value => otherUnitsPosition.indexOf(value) === -1);

        const friendlyPositions = this.unitsMediator.getFriendlyUnitsCords(this.name);

        let targetsPositions = aroundUnitPosition.filter(value => otherUnitsPosition.indexOf(value) > -1);

        targetsPositions = targetsPositions.filter(value => friendlyPositions.indexOf(value) === -1);

        return { allowed, targetsPositions, friendlyPositions };
    }

    _handleMovement() {
        const gridSquares = document.querySelectorAll('.gridSquare');

        for (const gridSquare of gridSquares) {
            gridSquare.style.display = 'inline-block';
            gridSquare.classList.remove('gridSquareSelectable');
        }

        // allowed map
        const positions = this._getFormatedAroundUnitPositions(this.top, this.left);
        const allowed = positions.allowed;
        const targetsPositions = positions.targetsPositions;

        // get all allowed elements
        this.reachableSquares = Array.from(gridSquares).filter(square => {
            const cords = square.dataset.top + 'x' + square.dataset.left;
            for (const aw of allowed) {
                if (aw === cords) {
                    square.classList.add('gridSquareSelectable');
                    return true;
                }
            }
        });

        // mark all enemy position near unit
        this.reachableSquaresAttackable = Array.from(gridSquares).filter(e => {
            const cords = e.dataset.top + 'x' + e.dataset.left;
            for (const tp of targetsPositions) {
                if (tp === cords) {
                    e.classList.add('gridSquareAttackable');
                    return true;
                }
            }
        });

        Array.from(document.querySelectorAll('.unit.onTurn')).forEach((e) => {
            e.classList.remove('onTurn');
        });

        // add click event on every reachable square
        this.reachableSquares.forEach(square => {
            square.addEventListener('click', this._onMove);
        });
    }

    _onMove = (e) => {
        this._updatePosition(e.currentTarget.dataset);
    }

    _handleEndTurn() {
        if (this.reachableSquares) {
            for (const gridSquare of this.reachableSquares) {
                gridSquare.style.display = 'none';
                gridSquare.classList.remove('gridSquareSelectable');
                gridSquare.removeEventListener('click', this._onMove, false);
            }
        }

        if (this.reachableSquaresAttackable) {
            for (const gridSquare of this.reachableSquaresAttackable) {
                gridSquare.classList.remove('gridSquareAttackable');
            }
        }

        this._onMovementEnd();
    }

    _getAllUnitsExceptCurrent() {
        return Array.from(document.querySelectorAll('div.unit:not(.' + this.name + '):not(.passedTurn)'));
    }

    _onMovementEnd() {
        this.reachableSquares = null;
        this.reachableSquaresAttackable = null;

        this.unitsMediator.notifyMediator('finished', this.name);
    }

    _die() {
        this.element.classList.add('deathAnimation');
        setTimeout(() => {
            this.element.remove();
            delete this.platform.unitsMapPosition[this.name];
            delete this.platform.unitsMap[this.name];
            this.unitsMediator.removeUnit(this.name);
        }, 1000);
    }
}