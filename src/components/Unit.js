import ElementsUtil from './utils/ElementsUtil.js'

export default class Unit {
    constructor({ name, hp, baseDMG, top, left, imageURL }, platform, player) {
        this.player = player;
        this.platform = platform;

        this.hp = hp;
        this.name = name;
        this.baseDMG = baseDMG;
        this.image = imageURL;
        this.top = top;
        this.left = left;
        this.initialHP = this.hp; // don't change
        this.cord = this.top + 'x' + this.left;

        this.platform.unitsMapPosition[this.name] = this.top + 'x' + this.left;
        this.friendlyPositions = {};

        this.unitsMediator = null; // get info for current state of all friendly units

        this.isFrozen = false;
        this.isPassedTurn = false;
        this.isActive = false;

        this._init();
    }

    _init = () => {
        const cords = this.platform.offsetMap[this.left][this.top];

        this.element = ElementsUtil.createElement('div', {
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

        // this.element = document.createElement('div');
        // this.element.style.top = cords.top + 'px';
        // this.element.style.left = cords.left + 'px';
        // this.element.classList.add('unit');
        // this.element.classList.add(this.name);
        // this.element.dataset.name = this.name;
        // this.element.dataset.top = this.top;
        // this.element.dataset.left = this.left;
        // this.element.dataset.player = this.player;

        this.imgEL = ElementsUtil.createElement('img', {
            src: this.image,
            style: {
                animationDelay: Math.floor(Math.random() * 10) + '00ms'
            }
        });
        
        // this.imgEL = document.createElement('img');
        // this.imgEL.src = this.image;
        // this.imgEL.style.animationDelay = Math.floor(Math.random() * 10) + '00ms';

        this.healthEL = ElementsUtil.createElement('div', {
            class: 'healthEL',
            style: {
                height: (this.hp * 0.25) + 'px'
            }
        });

        // this.healthEL = document.createElement('div');
        // this.healthEL.className = 'healthEL';
        // this.healthEL.style.height = (this.hp * 0.25) + 'px';

        this.takeDamageEL = ElementsUtil.createElement('div', {
            class: 'takeDamageEL',
        });

        // this.takeDamageEL = document.createElement('div');
        // this.takeDamageEL.className = 'takeDamageEL';
        
        this.detailsEL = ElementsUtil.createElement('div', {
            class: 'detailsEL',
        });

        // this.detailsEL = document.createElement('div');
        // this.detailsEL.className = 'detailsEL';

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

    _attack(target, attackType = 'male') {
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
                this.element.appendChild(spellParticle);
                setTimeout(() => {
                    spellParticle.style.transform = `translate3d(${(target.left - this.left) * 80}px, ${(target.top - this.top) * 80}px, 0)`;
                }, 10);
                setTimeout(() => {
                    spellParticle.remove();
                }, 250);
            }
                break;
            default: {};
        }


        target.hp -= this.baseDMG;

        if (target.hp <= 0) {
            target._die();
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
        if (this.isEnemy) {
            const Attacker = this.unitsMediator.platform.getCurrentActiveUnit();
            if (Attacker) {
                this._takeDamageAnimation(Attacker.baseDMG);
                Attacker._attack(this);
                setTimeout(() => {
                    Attacker._handleEndTurn();
                }, 400);
            }
        }

        if (this.isActive) {
            this._handleEndTurn();
            return;
        }

        if (!this.isFrozen && !this.isPassedTurn) {
            this._handleMovement();
            this.unitsMediator.notifyMediator('activated', this.name);
        }
    }

    _getGeneralDetails(data) {
        return `
            <p class="stat">${data.name}</p>
            <p  class="stat">HP: ${data.hp}/${data.initialHP}</p> 
            <p  class="stat">DMG: ${data.baseDMG}</p> 
        `;
    }

    enchanceGeneraDetails(content) {
        this.details += `<p class="stat">${content}</p>`
    }

    _setDetailsContentToElement() {
        this.detailsEL.innerHTML = this.details;
    }

    activateUnitInteraction() {
        this.element.addEventListener('click', this._onClickOnUnit);
        this.element.addEventListener('mouseenter', e => {
            this.setDetailsTooltipTimeout = setTimeout(() => {
                this.element.classList.add('upFront');
                this.detailsEL.classList.add('detailsELVisible');
            }, 2000);
        });
        this.element.addEventListener('mouseleave', e => {
            if (this.setDetailsTooltipTimeout) {
                clearTimeout(this.setDetailsTooltipTimeout);
            }
            this.element.classList.remove('upFront');
            this.detailsEL.classList.remove('detailsELVisible');
        });
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