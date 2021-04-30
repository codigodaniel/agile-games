//***************
// Game  02
//***************

/* Dependencies
*/

class G02_SectionElement{
    section = 2;
}

class G02_ConfigSim extends G02_SectionElement{
    capacity;
    team_size;
    team_age;

// initialization

    init(){
    }

    init_html(){
    }

// frontend actions

    set_capacity(v){
        this.capacity = v;
    }

    set_team_size(v){
        this.team_size = v;
    }

    set_team_age(v){
        this.team_age = v;
    }

    reset_game(){

    }

    run(){
        this.update_logs();
    }


// OUTPUT

    calculate_productivity_index(){
        return 1;
    }
    calculate_roi(){
        return 1;
    }

    calculate_speed(){
        return 1;
    }

    calculate_quality(){
        return 1;
    }

    calculate_commitment(){
        return 1;
    }

    calculate_complexity(){
        return 1;
    }

    update_logs(){
        write("o-roi-g02",this.calculate_roi());
        write("o-speed-g02",this.calculate_speed());
        write("o-quality-g02",this.calculate_quality());
        write("o-commitment-g02",this.calculate_commitment());
        write("o-complexity-g02",this.calculate_complexity());
    }

}

//*******************
//      SETUP
//*******************

var G02_game = new G02_ConfigSim();

G02_game.init();