<?php
require('fpdf.php');
	//  Define variable
	$info=array();
	$info['buyer_name']='Reza';
	$info['firm_name']='Reza';
	$info['salesperson_name']='Reza';
	$info['agreement_commence']='Reza';
	$info['agreement_expire ']='Reza';
	$info['employment_other']='rrr';
	$info['agency_other']='rrr';
	$info['retainer_fee']='rrr';
	$info['amount_compensation']='rrr';
	$info['agrees_days']='rrr';
	$info['additional_terms']='rrr';
	$info['buyers_signiture1']='rrr';
	$info['buyers_signiture_date1']='12-07-2014';
	$info['buyers_signiture2']='wwwwwwwwwwwww';
	$info['buyers_signiture_date2']='12-05-2018';
	$info['street']='rrrefeeeeeeer drgrdtht dfgrthte6 dfrgrd';
	$info['city']='dhaka';
	$info['state']='feni';
	$info['zip_code']='1204';
	$info['telephone']='016596+6+6+6++';
	$info['fax']='86896';
	$info['firm_name1']='5678687';
	$info['salesperson_signiture']='5876586868';
	$info['salesperson_date']='68686';
	$info['brokerage_file']='696896';
	$info['managers_initials']='6986896';
	$info['brokers_initials']='68689';
	$info['brokers_date']='7896896';
	
class PDF extends FPDF
{
var $B;
var $I;
var $U;
var $HREF;

function PDF($orientation='P', $unit='mm', $size='A4')
{
    // Call parent constructor
    $this->FPDF($orientation,$unit,$size);
    // Initialization
    $this->B = 0;
    $this->I = 0;
    $this->U = 0;
    $this->HREF = '';
}

function WriteHTML($html)
{
    // HTML parser
    $html = str_replace("\n",' ',$html);
    $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
    foreach($a as $i=>$e)
    {
        if($i%2==0)
        {
            // Text
            if($this->HREF)
                $this->PutLink($this->HREF,$e);
            else
                $this->Write(5,$e);
        }
        else
        {
            // Tag
            if($e[0]=='/')
                $this->CloseTag(strtoupper(substr($e,1)));
            else
            {
                // Extract attributes
                $a2 = explode(' ',$e);
                $tag = strtoupper(array_shift($a2));
                $attr = array();
                foreach($a2 as $v)
                {
                    if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                        $attr[strtoupper($a3[1])] = $a3[2];
                }
                $this->OpenTag($tag,$attr);
            }
        }
    }
}

function OpenTag($tag, $attr)
{
    // Opening tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,true);
    if($tag=='A')
        $this->HREF = $attr['HREF'];
    if($tag=='BR')
        $this->Ln(5);
}

function CloseTag($tag)
{
    // Closing tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,false);
    if($tag=='A')
        $this->HREF = '';
}

function SetStyle($tag, $enable)
{
    // Modify style and select corresponding font
    $this->$tag += ($enable ? 1 : -1);
    $style = '';
    foreach(array('B', 'I', 'U') as $s)
    {
        if($this->$s>0)
            $style .= $s;
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
    // Put a hyperlink
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}


//Cell with horizontal scaling if text is too wide
	function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
	{
		//Get string width
		$str_width=$this->GetStringWidth($txt);

		//Calculate ratio to fit cell
		if($w==0)
			$w = $this->w-$this->rMargin-$this->x;
		$ratio = ($w-$this->cMargin*2)/$str_width;

		$fit = ($ratio < 1 || ($ratio > 1 && $force));
		if ($fit)
		{
			if ($scale)
			{
				//Calculate horizontal scaling
				$horiz_scale=$ratio*100.0;
				//Set horizontal scaling
				$this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
			}
			else
			{
				//Calculate character spacing in points
				$char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
				//Set character spacing
				$this->_out(sprintf('BT %.2F Tc ET',$char_space));
			}
			//Override user alignment (since text will fill up cell)
			$align='';
		}

		//Pass on to Cell method
		$this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);

		//Reset character spacing/horizontal scaling
		if ($fit)
			$this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
	}

	//Cell with horizontal scaling only if necessary
	function CellFitScale($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,false);
	}

	//Cell with horizontal scaling always
	function CellFitScaleForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,true);
	}

	//Cell with character spacing only if necessary
	function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
	}

	//Cell with character spacing always
	function CellFitSpaceForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		//Same as calling CellFit directly
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,true);
	}

	//Patch to also work with CJK double-byte text
	function MBGetStringLength($s)
	{
		if($this->CurrentFont['type']=='Type0')
		{
			$len = 0;
			$nbbytes = strlen($s);
			for ($i = 0; $i < $nbbytes; $i++)
			{
				if (ord($s[$i])<128)
					$len++;
				else
				{
					$len++;
					$i++;
				}
			}
			return $len;
		}
		else
			return strlen($s);
	}





//  Code for creating pdf

// Page header
function Header()
{	if($this->PageNo() == 1){
	$this->SetFont('Arial','B',10);
	$this->Cell(0,1,'Presidential Realty',0,1,'L');
	$this->SetFont('Arial','B',16);
	$this->Cell(100,12,'BUYER-BROKER EXCLUSIVE EMPLOYMENT AGREEMENT',0,0,'L');
	$this->SetFont('Arial','',10);
	$this->Cell(0,3,'Page '.$this->PageNo().' of {nb}','',1,'R');
	$this->SetX(170);
	$this->Cell(0,5,'Document updated:','L',1,'C');
	$this->SetX(170);
	$this->SetFont('Arial','B',10);
	$this->Cell(0,4,'February 2011','L',1,'C');
	
	$this->Cell(50,28,$this->Image('images/arizona_left.png',10, $this->GetY()+4,50,20),'1',0,'C');
	$this->SetFont('Arial','B',9);
	
	$this->MultiCell(110,4,"The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. Any change in the pre-printed language of this form must be made in a prominent manner. No representations are made as to the legal validity, adequacy and/or effects of any provision, including tax consequences thereof. If you desire legal, tax or other professional advice, please consult your attorney, tax advisor or professional consultant.",'1','L');
	$this->SetY(23);
	$this->SetX(170);
	$this->Cell(30,28,$this->Image('images/arizona_right.png',172, $this->GetY()+6,25,0),'1',0,'C');
	}
    
}

// Page footer
function Footer()
{	

	global $info;
	if($this->PageNo() == 1){
	$str1=utf8_decode('Buyer-Broker Exclusive Employment Agreement • Updated: February 2010 ');
	$str2=utf8_decode('Copyright © 2010 Arizona Association of REALTORS®. All rights reserved.');
	$this->SetFont('Arial','',8);
	$this->Cell(25,5,'','',1,'');
	$this->Cell(200,3,'','B',1,'');  	
	$this->Cell(200,4,$str1,'',1,'C'); 
	$this->Cell(200,4,$str2,'',1,'C'); 
	$this->Cell(200,2,'','T',1,'');  
	
	$this->Cell(200,2,'','',1,'');  
	$this->Cell(0,3,'Page '.$this->PageNo().' of {nb}','',1,'C');
	
	$this->Cell(180,2,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',1,'L'); 	
	$this->Cell(40,5,'Phone: Fax:480-235-1400','',0,'');
	$this->Cell(20,5,'','',0,'');
	$this->Cell(30,5,"480-212-5464",'',0,'');
	$this->Cell(20,5,'','',0,'');  
	$this->Cell(30,5,"Steve Peterson",'',0,'');
	$this->Cell(20,5,'','',0,'');  
	$this->Cell(10,5,"delete",'',1,'');
	
	$this->Image('images/footer_qr_code.png',$this->GetX()+182,$this->GetY()-10,15,0);
	$this->Ln();
	
	$this->SetY($this->GetY()-5);
	$this->SetX(60);
	$this->SetFont('Arial','',6);
	$this->Cell(70,3,$str2,0,0,'C');
	$this->SetX($this->GetX()+10);
	$this->SetFont('Arial','U',6);
	$this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
    }
	if($this->PageNo() == 2){
	$str1=utf8_decode('Buyer-Broker Exclusive Employment Agreement • Updated: February 2010');
	$str2=utf8_decode('Copyright © 2010 Arizona Association of REALTORS®. All rights reserved.');
	$str3=utf8_decode('Produced with zipForm® by zipLogix  18070 Fifteen Mile Road, Fraser, Michigan 48026');
	$this->Cell(25,5,'','',1,'');
	
	$this->Line(15,$this->GetY(),205,$this->GetY());
	$this->Line(15,$this->GetY(),15,$this->GetY()+14);
	$this->Line(205,$this->GetY(),205,$this->GetY()+14);
	$this->Line(15,$this->GetY()+14,205,$this->GetY()+14);
	
	$this->SetFont('Arial','B',8);	
	$this->Cell(5,1,'','',0,''); 	// Broker use
	$this->Cell(20,5,'For Broker Use Only:','',1,'');
	$this->SetFont('Arial','',8);
	$this->Cell(5,1,'','',0,'');
	$this->Cell(30,5,'Brokerage File/Log No.','',0,'');
	$this->Cell(20,5,$info['brokerage_file'],'B',0,'C');
	$this->Cell(25,5,"Manager's Initials.",'',0,'');
	$this->Cell(30,5,$info['managers_initials'],'B',0,'C');  
	$this->Cell(25,5,"Broker's Initials.",'',0,'');
	$this->Cell(30,5,$info['brokers_initials'],'B',0,'C');  
	$this->Cell(10,5,"Date",'',0,'');
	$this->Cell(20,5,$info['brokers_date'],'B',2,'C'); 
	$this->Cell(20,5,'MO/DA/YR','T',1,'C');
	
	$this->SetFont('Arial','',8);
	$this->Cell(200,3,'','B',1,'');  	
	$this->Cell(200,4,$str1,'',1,'C'); 
	$this->Cell(200,4,$str2,'',1,'C'); 
	$this->Cell(200,2,'','T',1,'');  
	
	$this->Cell(200,2,'','',1,'');  
	
	$this->Cell(20,5,'','',1,'');  
	$this->Cell(200,5,'Page '.$this->PageNo().' of {nb}','',1,'C');  
	$this->Cell(20,5,'','',1,''); 
	
	$this->Image('images/footer_qr_code.png',$this->GetX()+182,$this->GetY()-7,15,0);
	$this->Ln();
	
	$this->SetY($this->GetY()-5);
	$this->SetX(60);
	$this->SetFont('Arial','',6);
	$this->Cell(70,3,$str3,0,0,'C');
	$this->SetX($this->GetX()+10);
	$this->SetFont('Arial','U',6);
	$this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
	}
}

}

$pdf = new PDF('P','mm',array(215,335));
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetY(30);
$pdf->SetX(22);
$pdf->Ln();	

//text

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'1.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,8,"Buyer/Tenant:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(150,6,$info['buyer_name'],'B',0,'');
	$pdf->Cell(20,8,'("Buyer")','',1,'');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'2.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(10,8,"Firm:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(70,6,$info['firm_name'],'B',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,8,"Salesperson:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(70,6,$info['salesperson_name'],'B',0,'');
	$pdf->Cell(20,8,'("Broker")','',1,'C');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(100,1,'(FIRM NAME)','',0,'C');
	$pdf->Cell(100,1,"(SALESPERSON'S NAME)",'',1,'C');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'3.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(10,5,"Term:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(50,5,'This Agreement shall commence on','',0,'');
	$pdf->Cell(30,4,$info['agreement_commence'],'B',0,'');
	$pdf->Cell(40,5,"and expire at 11:59 p.m. on",'',0,'');
	$pdf->Cell(50,4,$info['salesperson_name'],'B',0,'');
	$pdf->Cell(2,5,'.','',1,'C');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'4.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,5,"Employment:",'',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(50,5,"Broker agrees to:",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'5.','',0,'');
	$pdf->Cell(5,5,"a:",'',0,'');
	$pdf->Cell(50,5,"locate Property meeting the following general description:",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(10,5,'6.','',0,'');
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->Cell(20,5,'Residential','',0,''); 
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->Cell(10,5,'Land','',0,''); 
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->Cell(20,5,'Commercial','',0,''); 
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->Cell(10,5,'Other','',0,''); 
	$pdf->Cell(95,5,$info['employment_other'],'B',0,''); 
	$pdf->Cell(15,5,'("Property")','',1,'C'); 

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'7.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"b. negotiate at Buyer's direction to obtain acceptable terms and conditions for the purchase, exchange, option or lease of the Property;",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'8.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"c. assist Buyer during the transaction within the scope of Broker’s expertise and licensing.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'9.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(30,5,'Agency Relationship','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"The agency relationship between Buyer and Broker shall be:",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(10,5,'10.','',0,'');
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"as set forth in the Real Estate Agency Disclosure and Election form.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(10,5,'11.','',0,'');
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(10,5,"Other",'',0,'');
	$pdf->Cell(80,5,$info['agency_other'],'B',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'12.','',0,''); 
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,5,"Retainer Fee: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(85,5,'Buyer agrees to pay Broker a non-refundable fee in the amount of $','',0,'');
	$pdf->Cell(30,5,$info['retainer_fee'],'B',0,'');
	$pdf->Cell(40,5,', which is earned when paid, for initial','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'13.','',0,'');
	$pdf->Cell(50,5,'consultation and research. This fee','',0,'');
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(15,5,"shall; or",'',0,'');
	$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 
	$pdf->Cell(15,5,"shall not",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(80,5,'be credited against any other compensation owed by Buyer to','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'14.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Broker as pursuant to Lines 27 - 29.",'',1,'');
	
	$pdf->Cell(0,3,"",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'15.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(27,5,'Property Viewings: ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(90,5,"Buyer agrees to work exclusively with Broker and be accompanied by Broker on Buyer's first visit to any Property.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'16.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(0,5,'If Broker does not accompany Buyer on the first visit to any Property, including a model home, new home/lot or "open house"','',1,'');


	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'17.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(0,5,"held by a builder, seller or other real estate broker, Buyer acknowledges that the builder, seller or seller's broker may refuse to ",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'18.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(0,5,"compensate Broker, which will eliminate any credit against the compensation owed by Buyer to Broker.",'',1,'');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'19.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(20,5,'Due Diligence: ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Once an acceptable Property is located, Buyer agrees to act in good faith to acquire the Property and conduct any",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'20.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"inspections/investigations of the Property that Buyer deems material and/or important.",'',1,'');
	
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'21.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Note: Buyer acknowledges that pursuant to Arizona law, Sellers, Lessors and Brokers are not obligated to disclose that a Property is",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'22.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"or has been: (1) the site of a natural death, suicide, homicide, or any crime classified as a felony; (2) owned or occupied by a person",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'23.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"exposed to HIV, or diagnosed as having AIDS or any other disease not known to be transmitted through common occupancy of real",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'24.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"estate; or (3) located in the vicinity of a sex offender.",'',1,'');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'25.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(0,5,"Buyer agrees to consult the Arizona Department of Real Estate Buyer Advisory provided by the Arizona Association of",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'26.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(0,5,utf8_decode("REALTORS® at www.aaronline.com to assist in Buyer's inspections and investigations."),'',1,'');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'27.','',0,'');
	$pdf->SetFont('Arial','b',8);
	$pdf->Cell(25,5,'Compensation: ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Buyer agrees to compensate Broker as follows:",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'28.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(50,5,"The amount of compensation shall be: ",'',0,'');
	$pdf->Cell(70,5,$info['amount_compensation'],'B',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'29.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"or the compensation Broker receives from seller or seller's broker, whichever is greater. In either event, Buyer authorizes Broker to accept",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'30.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"compensation from seller or seller's broker, which shall be credited against any compensation owed by Buyer to Broker pursuant to this",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'31.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Agreement. Broker's compensation shall be paid at the time of and as a condition of closing or as otherwise agreed upon in writing.",'',1,'');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'32.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(65,5,"Buyer agrees to pay such compensation if within",'',0,'');
	$pdf->Cell(30,5,$info['agrees_days'],'B',0,'');
	$pdf->Cell(60,5,"calendar days after the termination of this Agreement, Buyer enters into an",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'33.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"agreement to purchase, exchange, option or lease any Property shown to Buyer or negotiated by Broker on behalf of the Buyer during the",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'34.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"term of this Agreement, unless Buyer has entered into a subsequent buyer-broker exclusive employment agreement with another broker.",'',1,'');
	$pdf->Cell(0,3,"",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'35.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"If completion of any transaction is prevented by Buyer's breach or with the consent of Buyer other than as provided in the purchase",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'36.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"contract, the total compensation shall be due and payable by Buyer.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'37.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"COMMISSIONS   PAYABLE   ARE   NOT   SET   BY   ANY   BOARD   OR   ASSOCIATION   OF   REALTORS®   OR   MULTIPLE",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'38.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"LISTING   SERVICE   OR   IN   ANY   MANNER   OTHER   THAN   AS   NEGOTIATED   BETWEEN   BROKER   AND   BUYER.",'',1,'');

	$pdf->SetFont('Arial','',12);
	$pdf->Cell(200,10,">>",'',1,'R');
	
	$pdf->AddPage();
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(200,5,'Page '.$pdf->PageNo().' of {nb}','',1,'R');
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(5,5,'','',0,'L');
	$pdf->Cell(180,5,'Buyer-Broker Exclusive Employment Agreement >> ','',2,'L');
	$pdf->Cell(180,1,'','B',1,'L');
	$pdf->Cell(180,3,' ','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,7,'39.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,7,'Additional Terms:  ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(150,5,$info['additional_terms'],'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'40.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'41.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'42.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'43.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'45.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'46.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,7,'47.','',0,'');
	$pdf->Cell(172,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'48.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(38,5,"Equal Housing Opportunity:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Equal Housing Opportunity: Broker's policy is to abide by all local, state, and federal laws prohibiting discrimination against any",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'49.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"individual or group of individuals. Broker has no duty to disclose the racial, ethnic, or religious composition of any neighborhood,",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'50.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"community, or building, nor whether persons with disabilities are housed in any home or facility, except that the Broker may identify",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'51.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"housing facilities meeting the needs of a disabled buyer.",'',1,'');
	$pdf->Cell(5,2,'','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'52.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(35,5,"Other Potential Buyers:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Other Potential Buyers: Buyer consents and acknowledges that other potential buyers represented by Broker may consider, make",'',1,'');
	
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'53.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"offers on, or acquire an interest in the same or similar properties as Buyer is seeking.",'',1,'');
	$pdf->Cell(5,2,'','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'54.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(55,5,'Alternative Dispute Resolution ("ADR"): ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->MultiCell(0,5,'Buyer and Broker agree to mediate any dispute or claim arising out of or relating to this','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'55.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Agreement in accordance with the mediation procedures of the applicable state or local REALTOR® association or as otherwise",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'56.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"agreed. All mediation costs shall be paid equally by the parties. In the event that mediation does not resolve all disputes or claims,",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'57.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"the unresolved disputes or claims shall be submitted for binding arbitration. In such event, the parties shall agree upon an arbitrator",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'58.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"and cooperate in the scheduling of an arbitration hearing. If the parties are unable to agree on an arbitrator, the dispute shall be",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'59.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'submitted to the American Arbitration Association ("AAA") in accordance with the AAA Arbitration Rules for the Real Estate Industry.','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'60.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"The decision of the arbitrator shall be final and nonappealable. Judgment on the award rendered by the arbitrator may be entered in",'',1,'');
	$pdf->Cell(5,2,'','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'61.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"any court of competent jurisdiction.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'62.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(35,5,"Attorney Fees and Costs: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"In any non-REALTOR® association proceeding to enforce the compensation due to Broker pursuant to",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'63.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"this Agreement, the prevailing party shall be awarded their reasonable attorney fees and arbitration costs.",'',1,'');
	$pdf->Cell(5,2,'','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'64.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,5,"Arizona Law:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"AThis Agreement shall be governed by Arizona law and jurisdiction is exclusively conferred on the State of Arizona.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'65.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(37,5,"Copies and Counterparts:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"This Agreement may be executed by facsimile or other electronic means and in any number of",'',1,'');
	$pdf->Cell(5,2,'','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'66.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"counterparts. A fully executed facsimile or electronic copy of the Agreement shall be treated as an original Agreement.",'',1,'');
	$pdf->Cell(5,2,'','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'67.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,5,"Entire Agreement:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"This Agreement, and any addenda and attachments, shall constitute the entire agreement between Buyer and",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'68.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Broker, shall supersede any other written or oral agreements between Buyer and Broker and can be modified only by a writing",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'69.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"signed by Buyer and Broker.",'',1,'');
	$pdf->Cell(5,2,'','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'70.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(15,5,"Capacity: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Capacity: Buyer warrants that Buyer has the legal capacity, full power and authority to enter into this Agreement and consummate",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'71.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"the transaction contemplated hereby on Buyer’s own behalf or on behalf of the party Buyer represents, as appropriate.",'',1,'');
	$pdf->Cell(5,2,'','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'72.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,5,"Acceptance: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Acceptance: Buyer hereby agrees to all of the terms and conditions herein and acknowledges receipt of a copy of this Agreement.",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'73.','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture1'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date1'],'',0,'R');
	$pdf->Cell(14,7,'','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture2'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date2'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'74.','',0,'');
	$pdf->Cell(70,7,$info['street'],'',0,'L');
	$pdf->Cell(35,7,$info['city'],'',0,'C');
	$pdf->Cell(20,7,$info['state'],'',0,'C');
	$pdf->Cell(20,7,$info['zip_code'],'',1,'R');
	$pdf->Cell(7,2,'','',0,'C');
	$pdf->Cell(170,2,'','T',1,'C');
	$pdf->Cell(14,5,'','',0,'C');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(70,2,"STREET",'',0,'L');
	$pdf->Cell(35,2,"CITY",'',0,'C');
	$pdf->Cell(20,2,"STATE",'',0,'C');
	$pdf->Cell(20,2,"ZIP CODE",'',1,'R');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'75.','',0,'');
	$pdf->Cell(80,7,$info['telephone'],'',0,'L');
	$pdf->Cell(10,7,'','',0,'');
	$pdf->Cell(80,7,$info['fax'],'',1,'L');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(10,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,2,"TELEPHONE",'',0,'L');
	$pdf->Cell(10,2,"",'',0,'');
	$pdf->Cell(80,2,"FAX",'',1,'L');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'76.','',0,'');
	$pdf->Cell(70,7,$info['firm_name1'],'',0,'L');
	$pdf->Cell(10,7,'','',0,'');
	$pdf->Cell(50,7,$info['salesperson_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['salesperson_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(70,1,'','T',0,'');
	$pdf->Cell(10,1,'','',0,'');
	$pdf->Cell(90,1,'','T',1,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(70,2,"FIRM NAME",'',0,'L');
	$pdf->Cell(10,2,"",'',0,'');
	$pdf->Cell(50,2,"^ SALESPERSON SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');

$pdf->Output('','I');



?>